import { expect } from "chai";
import { ethers } from "hardhat";

describe("HoneyBatchRegistry", function () {
  let registry: any;
  let admin: any;
  let beekeeper: any;
  let laboratory: any;
  let processor: any;
  let packager: any;
  let distributor: any;
  let unauthorized: any;

  const BATCH_ID = ethers.keccak256(ethers.toUtf8Bytes("HNY-2026-TEST-001"));
  const METADATA_HASH = ethers.keccak256(ethers.toUtf8Bytes("Apiary: Kotagiri, Nilgiris"));
  const DOC_HASH = ethers.keccak256(ethers.toUtf8Bytes("CoA-Report-Eurofins.pdf"));
  const INITIAL_WEIGHT_GRAMS = 500000; // 500 kg

  beforeEach(async function () {
    [admin, beekeeper, laboratory, processor, packager, distributor, unauthorized] =
      await ethers.getSigners();

    const HoneyBatchRegistryFactory = await ethers.getContractFactory("HoneyBatchRegistry");
    registry = await HoneyBatchRegistryFactory.deploy(admin.address);
    await registry.waitForDeployment();

    // Grant roles
    const BEEKEEPER_ROLE = await registry.BEEKEEPER_ROLE();
    const LABORATORY_ROLE = await registry.LABORATORY_ROLE();
    const PROCESSOR_ROLE = await registry.PROCESSOR_ROLE();
    const PACKAGER_ROLE = await registry.PACKAGER_ROLE();
    const DISTRIBUTOR_ROLE = await registry.DISTRIBUTOR_ROLE();

    await registry.authorizeOrganization(BEEKEEPER_ROLE, beekeeper.address);
    await registry.authorizeOrganization(LABORATORY_ROLE, laboratory.address);
    await registry.authorizeOrganization(PROCESSOR_ROLE, processor.address);
    await registry.authorizeOrganization(PACKAGER_ROLE, packager.address);
    await registry.authorizeOrganization(DISTRIBUTOR_ROLE, distributor.address);
  });

  it("should allow an authorized beekeeper to create a batch", async function () {
    await expect(
      registry.connect(beekeeper).createBatch(BATCH_ID, INITIAL_WEIGHT_GRAMS, METADATA_HASH)
    )
      .to.emit(registry, "BatchCreated")
      .withArgs(BATCH_ID, beekeeper.address, INITIAL_WEIGHT_GRAMS, METADATA_HASH, (val: any) => val > 0);

    const b = await registry.getBatch(BATCH_ID);
    expect(b.creator).to.equal(beekeeper.address);
    expect(b.currentWeightGrams).to.equal(INITIAL_WEIGHT_GRAMS);
    expect(b.status).to.equal(0); // BatchStatus.CREATED
    expect(b.isRecalled).to.be.false;
  });

  it("should revert if an unauthorized account attempts to create a batch", async function () {
    await expect(
      registry.connect(unauthorized).createBatch(BATCH_ID, INITIAL_WEIGHT_GRAMS, METADATA_HASH)
    ).to.be.reverted;
  });

  it("should allow a laboratory to record quality tests and anchor document hash", async function () {
    await registry.connect(beekeeper).createBatch(BATCH_ID, INITIAL_WEIGHT_GRAMS, METADATA_HASH);

    await expect(
      registry.connect(laboratory).recordLabTest(BATCH_ID, DOC_HASH, true, "EA-IRMS Carbon Isotope")
    )
      .to.emit(registry, "LabTestRecorded")
      .withArgs(BATCH_ID, laboratory.address, DOC_HASH, true, "EA-IRMS Carbon Isotope", (val: any) => val > 0);

    const docHashOnChain = await registry.batchLabDocumentHashes(BATCH_ID);
    expect(docHashOnChain).to.equal(DOC_HASH);

    const b = await registry.getBatch(BATCH_ID);
    expect(b.status).to.equal(1); // BatchStatus.TESTED
  });

  it("should allow a processor to record transformations (DAG lineage)", async function () {
    await registry.connect(beekeeper).createBatch(BATCH_ID, INITIAL_WEIGHT_GRAMS, METADATA_HASH);

    const NEW_BATCH_ID = ethers.keccak256(ethers.toUtf8Bytes("HNY-2026-BLENDED-001"));
    const parents = [BATCH_ID];

    await expect(
      registry.connect(processor).recordTransformation(NEW_BATCH_ID, parents, 490000)
    )
      .to.emit(registry, "BatchTransformed")
      .withArgs(NEW_BATCH_ID, parents, processor.address, 490000, (val: any) => val > 0);

    const recordedParents = await registry.getParentBatches(NEW_BATCH_ID);
    expect(recordedParents[0]).to.equal(BATCH_ID);
  });

  it("should allow emergency recall and prevent subsequent mutations", async function () {
    await registry.connect(beekeeper).createBatch(BATCH_ID, INITIAL_WEIGHT_GRAMS, METADATA_HASH);

    // Admin executes recall
    await expect(
      registry.connect(admin).recallBatch(BATCH_ID, "Adulterated with corn syrup")
    )
      .to.emit(registry, "BatchRecalled")
      .withArgs(BATCH_ID, admin.address, "Adulterated with corn syrup", (val: any) => val > 0);

    const b = await registry.getBatch(BATCH_ID);
    expect(b.isRecalled).to.be.true;
    expect(b.status).to.equal(6); // BatchStatus.RECALLED

    // Lab test on recalled batch should revert
    await expect(
      registry.connect(laboratory).recordLabTest(BATCH_ID, DOC_HASH, false, "Retest")
    ).to.be.revertedWithCustomError(registry, "BatchAlreadyRecalled");
  });
});
