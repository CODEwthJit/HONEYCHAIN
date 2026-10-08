// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HoneyAccessControl
 * @notice Role-Based Access Control for the HoneyChain supply-chain ecosystem.
 */
contract HoneyAccessControl is AccessControl {
    bytes32 public constant BEEKEEPER_ROLE = keccak256("BEEKEEPER_ROLE");
    bytes32 public constant LABORATORY_ROLE = keccak256("LABORATORY_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant PACKAGER_ROLE = keccak256("PACKAGER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    error UnauthorizedActor(address account, bytes32 requiredRole);

    event OrganizationRoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event OrganizationRoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
    }

    /**
     * @notice Grants a supply-chain role to an authorized organization address.
     */
    function authorizeOrganization(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
        emit OrganizationRoleGranted(role, account, msg.sender);
    }

    /**
     * @notice Revokes a supply-chain role from an organization.
     */
    function revokeOrganization(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
        emit OrganizationRoleRevoked(role, account, msg.sender);
    }

    /**
     * @notice Checks if an address holds a specific role.
     */
    function isAuthorized(bytes32 role, address account) external view returns (bool) {
        return hasRole(role, account);
    }
}
