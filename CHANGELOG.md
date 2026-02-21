# Changelog

All notable changes to the Hagzy project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Feature branching setup for `development` branch separation from `main` production environment.
- Git initialization across the workspace to preserve historical architecture integrity.

## [v0.1.0] - 2026-02-21

### Added
- **Commissions Calculator:** Fully functional React module supporting interactive filtration for Employees, Start Date, and End Date.
- **Dynamic KPI Engine:** Synchronous aggregation calculations dynamically refreshing Revenue, Commission, and Average Rate stats.
- **By Segments Flow:** Cross-referenced business sector reductions calculating accurate group distributions (Hair Care, Skincare, Spa, etc.).
- **By Target Flow:** Intrinsic percentage mapping applying flat bonuses and Tiered Multipliers (1.5x at 120%, 2.0x at 150%) against predefined monthly revenue quotas.
- **Extraction Flow:** Flat 15% material/product extraction cost calculator applied against Gross Revenue before calculating final Net Commission allocations.

### Changed
- UI layout fixes to normalize `Attendance Settings` visual constraints, spreading grid boxes across the parent container evenly instead of constricting them to a 700px maximum width.
- Refactored UI logic to gracefully fallback empty datatypes to custom `EmptyState` graphic components.

### Removed
- Outdated sub-navigation tab hooks linked to empty views within the parent `employees/layout`.
