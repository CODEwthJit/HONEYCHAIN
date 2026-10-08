// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./HoneyAccessControl.sol";

/**
 * @title HoneyBatchRegistry
 * @notice Verifiable, tamper-evident registry for honey supply chain batch lifecycle events.
 */
contract HoneyBatchRegistry is HoneyAccessControl {
    enum BatchStatus {
        CREATED,
        TESTED,
        PROCESSED,
        PACKAGED,
        IN_TRANSIT,
        DELIVERED,
        RECALLED
    }

    struct Batch {
        bytes32 batchId;
        bytes32 metadataHash;
        address creator;
        uint64 createdAt;
        uint32 currentWeightGrams;
        BatchStatus status;
        bool isRecalled;
    }

    // Storage mappings
    mapping(bytes32 => Batch) public batches;
    mapping(bytes32 => bytes32[]) public batchLineage; // Child batch => Parent batch IDs (DAG)
    mapping(bytes32 => bytes32) public batchLabDocumentHashes; // Batch ID => Latest SHA-256 document hash

    // Custom Errors for gas optimization
    error BatchAlreadyExists(bytes32 batchId);
    error BatchNotFound(bytes32 batchId);
    error BatchAlreadyRecalled(bytes32 batchId);
    error InvalidWeight();
    error InvalidParentCount();

    // Events monitored and indexed by Ponder
    event BatchCreated(
        bytes32 indexed batchId,
        address indexed beekeeper,
        uint32 initialWeightGrams,
        bytes32 metadataHash,
        uint64 timestamp
    );

    event LabTestRecorded(
        bytes32 indexed batchId,
        address indexed labAddress,
        bytes32 documentHash,
        bool passed,
        string testType,
        uint64 timestamp
    );

    event BatchTransformed(
        bytes32 indexed newBatchId,
        bytes32[] parentBatchIds,
        address indexed processor,
        uint32 outputWeightGrams,
        uint64 timestamp
    );

    event PackagingRecorded(
        bytes32 indexed batchId,
        bytes32 indexed lotNumberHash,
        address indexed packager,
        uint32 unitCount,
        uint64 timestamp
    );

    event CustodyTransferred(
        bytes32 indexed batchId,
        address indexed fromActor,
        address indexed toActor,
        string locationString,
        uint64 timestamp
    );

    event BatchRecalled(
        bytes32 indexed batchId,
        address indexed recalledBy,
        string reason,
        uint64 timestamp
    );

    constructor(address initialAdmin) HoneyAccessControl(initialAdmin) {}

    /**
     * @notice Registers a new raw honey harvest batch.
     */
    function createBatch(
        bytes32 batchId,
        uint32 initialWeightGrams,
        bytes32 metadataHash
    ) external onlyRole(BEEKEEPER_ROLE) {
        if (batches[batchId].createdAt != 0) revert BatchAlreadyExists(batchId);
        if (initialWeightGrams == 0) revert InvalidWeight();

        batches[batchId] = Batch({
            batchId: batchId,
            metadataHash: metadataHash,
            creator: msg.sender,
            createdAt: uint64(block.timestamp),
            currentWeightGrams: initialWeightGrams,
            status: BatchStatus.CREATED,
            isRecalled: false
        });

        emit BatchCreated(batchId, msg.sender, initialWeightGrams, metadataHash, uint64(block.timestamp));
    }

    /**
     * @notice Records laboratory test results and anchors the SHA-256 document certificate hash.
     */
    function recordLabTest(
        bytes32 batchId,
        bytes32 documentHash,
        bool passed,
        string calldata testType
    ) external onlyRole(LABORATORY_ROLE) {
        Batch storage b = batches[batchId];
        if (b.createdAt == 0) revert BatchNotFound(batchId);
        if (b.isRecalled) revert BatchAlreadyRecalled(batchId);

        batchLabDocumentHashes[batchId] = documentHash;
        if (b.status == BatchStatus.CREATED) {
            b.status = BatchStatus.TESTED;
        }

        emit LabTestRecorded(batchId, msg.sender, documentHash, passed, testType, uint64(block.timestamp));
    }

    /**
     * @notice Records transformation, blending, or splitting of honey batches (DAG lineage).
     */
    function recordTransformation(
        bytes32 newBatchId,
        bytes32[] calldata parentBatchIds,
        uint32 outputWeightGrams
    ) external onlyRole(PROCESSOR_ROLE) {
        if (batches[newBatchId].createdAt != 0) revert BatchAlreadyExists(newBatchId);
        if (parentBatchIds.length == 0) revert InvalidParentCount();
        if (outputWeightGrams == 0) revert InvalidWeight();

        // Check each parent exists and is not recalled
        for (uint256 i = 0; i < parentBatchIds.length; i++) {
            if (batches[parentBatchIds[i]].createdAt == 0) revert BatchNotFound(parentBatchIds[i]);
            if (batches[parentBatchIds[i]].isRecalled) revert BatchAlreadyRecalled(parentBatchIds[i]);
        }

        batchLineage[newBatchId] = parentBatchIds;

        batches[newBatchId] = Batch({
            batchId: newBatchId,
            metadataHash: bytes32(0),
            creator: msg.sender,
            createdAt: uint64(block.timestamp),
            currentWeightGrams: outputWeightGrams,
            status: BatchStatus.PROCESSED,
            isRecalled: false
        });

        emit BatchTransformed(newBatchId, parentBatchIds, msg.sender, outputWeightGrams, uint64(block.timestamp));
    }

    /**
     * @notice Records bottling of honey into jars and packaging lot generation.
     */
    function recordPackaging(
        bytes32 batchId,
        bytes32 lotNumberHash,
        uint32 unitCount
    ) external onlyRole(PACKAGER_ROLE) {
        Batch storage b = batches[batchId];
        if (b.createdAt == 0) revert BatchNotFound(batchId);
        if (b.isRecalled) revert BatchAlreadyRecalled(batchId);

        b.status = BatchStatus.PACKAGED;

        emit PackagingRecorded(batchId, lotNumberHash, msg.sender, unitCount, uint64(block.timestamp));
    }

    /**
     * @notice Records logistics custody transfer between supply-chain nodes.
     */
    function recordCustodyTransfer(
        bytes32 batchId,
        address toActor,
        string calldata locationString
    ) external onlyRole(DISTRIBUTOR_ROLE) {
        Batch storage b = batches[batchId];
        if (b.createdAt == 0) revert BatchNotFound(batchId);
        if (b.isRecalled) revert BatchAlreadyRecalled(batchId);

        b.status = BatchStatus.IN_TRANSIT;

        emit CustodyTransferred(batchId, msg.sender, toActor, locationString, uint64(block.timestamp));
    }

    /**
     * @notice Executes an emergency recall on a batch. Can be triggered by Admin or Laboratory.
     */
    function recallBatch(bytes32 batchId, string calldata reason) external {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender) && !hasRole(LABORATORY_ROLE, msg.sender)) {
            revert UnauthorizedActor(msg.sender, DEFAULT_ADMIN_ROLE);
        }

        Batch storage b = batches[batchId];
        if (b.createdAt == 0) revert BatchNotFound(batchId);

        b.isRecalled = true;
        b.status = BatchStatus.RECALLED;

        emit BatchRecalled(batchId, msg.sender, reason, uint64(block.timestamp));
    }

    /**
     * @notice Fetches core batch details for external verification.
     */
    function getBatch(bytes32 batchId) external view returns (Batch memory) {
        Batch memory b = batches[batchId];
        if (b.createdAt == 0) revert BatchNotFound(batchId);
        return b;
    }

    /**
     * @notice Returns parent batch IDs for a transformed batch.
     */
    function getParentBatches(bytes32 batchId) external view returns (bytes32[] memory) {
        return batchLineage[batchId];
    }
}
