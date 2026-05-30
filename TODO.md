# TODO - Parking Sales Management System (PSSMS)

## Steps
- [ ] Create React frontend (frontend-project) with Tailwind UI: menu bar + pages (car, parkingslot, parkingrecord, payment, report, logout).
- [ ] Create Node/Express backend (backend-project) exposing REST API for CRUD operations.
- [ ] Implement MySQL schema for tables: parkingslot, car, parkingrecord, payment.
- [ ] Implement PK/FK relations in DDL and backend models.
- [ ] Enforce operation rules:
  - [ ] car form: INSERT only
  - [ ] parkingslot form: INSERT only
  - [ ] parkingrecord form: DELETE/UPDATE/RETRIEVE allowed; INSERT allowed
  - [ ] payment form: INSERT only
- [ ] Implement report endpoints/UI (tables + aggregated/derived report output).
- [ ] Add .env config for MySQL.
- [ ] Add npm scripts + instructions to run.
- [ ] (Optional) Generate ERD (Mermaid) and include in README.

