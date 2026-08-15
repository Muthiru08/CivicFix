MASTER PROMPT — CIVICFIX END PRODUCT

You are continuing development of an existing product called CivicFix.

Do not treat this as a new startup idea.

Do not rebuild the application blindly.

CivicFix already has an existing application, Supabase/PostgreSQL backend, authentication, RLS, properties, units, maintenance requests, work orders, assignments, events, evidence, contractors/fundi concepts, QR infrastructure, Passport concepts, and tenant-history infrastructure.

Your job is to evolve the existing product into the complete CivicFix platform described below, while preserving working infrastructure and existing data.

1. WHAT CIVICFIX IS

CivicFix is a property operations and maintenance platform.

Think of the operational breadth and maturity of enterprise property-management systems such as Goyzer, but do not copy Goyzer's branding, UI, or implementation.

CivicFix should provide the serious property-management capabilities that users expect from a mature PMS while having a fundamentally different entry point:

The physical building itself becomes the digital entry point into the system.

CivicFix connects:

PROPERTY → BUILDING → UNIT → TENANT → ASSET → MAINTENANCE → FUNDIs/CONTRACTORS → PAYMENTS → EVIDENCE → HISTORY → PASSPORT

The product should feel capable enough to operate real property portfolios, not like a simple maintenance-ticket application.

2. THE CIVICFIX DIFFERENTIATOR

The core CivicFix loop is:

SCAN → REPORT → REVIEW → ASSIGN → FIX → PROVE → VERIFY → RECORD

A tenant can see a CivicFix QR code in a building.

They scan it.

They report a problem.

The system already knows the relevant:

property

building

floor

unit

room

location

asset where applicable

The tenant should not need to understand the internal CivicFix system.

They simply report:

"The kitchen sink is leaking."

CivicFix turns that into structured operational data.

3. DO NOT MAKE CIVICFIX JUST A MAINTENANCE APP

CivicFix should eventually function as a complete property operations platform.

The main modules should include:

Portfolio

organizations

property portfolios

properties

buildings

blocks

floors

units

rooms

common areas

parking

facilities

Tenants / occupants

tenant profiles

occupant records

unit occupancy

move-in

move-out

historical occupancy

current occupants

tenant communications

tenant documents

tenant maintenance history

Owners

owner profiles

ownership relationships

properties owned

owner reports

property performance

maintenance history

Leases

Eventually support:

lease records

start/end dates

rent

deposits

renewal

expiry

documents

tenant relationship

unit relationship

Do not overcomplicate lease management before the core maintenance workflow is excellent.

4. PERMANENT TENANT HISTORY

One important CivicFix capability is the historical tenant record.

A unit should not simply say:

Current tenant: John

and erase the previous occupant.

Instead:

UNIT B-204

Tenant history:

TenantMove-inMove-outTenant A20172019Tenant B20192022Tenant C20222025Tenant D2025Present

The system should allow authorized users to answer:

Who lived in this unit over the last 10 years?

Historical records must not be overwritten.

Use proper privacy controls.

Only authorized users should access sensitive tenant history.

5. PROPERTY PASSPORT

The Property Passport is a central long-term CivicFix concept.

It is not the primary thing we charge people for.

It is a valuable by-product of the operational system.

The Passport should eventually contain:

Property information

property

buildings

units

assets

locations

Maintenance history

issues reported

work orders

repairs

dates

contractors

evidence

verification

outcomes

Asset history

installation

maintenance

repairs

failures

replacements

inspections

Occupancy history

historical tenants/occupants

move-in

move-out

Financial information where appropriate

repair costs

maintenance costs

invoices

Inspections

inspection events

inspection findings

evidence

resolution

The Passport should answer:

"What has actually happened to this property?"

6. PASSPORT MUST BE PERSISTENT

The property record must survive:

tenant changes

caretaker changes

fundi changes

property-manager changes

management-company changes

The building's history belongs to the property, not to a particular manager's account.

This is one of CivicFix's most important long-term advantages.

7. CSV EXPORT

Authorized users must be able to export structured data.

Examples:

Tenant history CSV

property

building

unit

tenant

phone

move-in

move-out

status

Maintenance CSV

property

unit

issue

category

requester

assigned worker

dates

status

cost

verification

Fundi CSV

fundi

trade

jobs

completion rate

ratings

property relationships

Property Passport export

Provide an exportable property history.

CSV is required.

PDF/property-report export can be added later.

Never expose information to users who do not have permission to export it.

8. QR CODE SYSTEM

QR codes are a defining CivicFix feature.

Every QR code should have an internal identifier.

A QR can represent:

property

building

block

floor

unit

room

common area

asset

maintenance location

Example:

CivicFix Apartments

QR:

Building A → Floor 2 → Unit B-204 → Kitchen

When scanned:

QR → CivicFix → contextual reporting

The QR should not expose sensitive information directly.

QR records should support:

active/inactive

installation date

location

property

unit

asset

created by

deactivation date

replacement history

QR codes should be deactivated rather than permanently deleted wherever possible.

9. TENANT REPORTING

The preferred CivicFix reporting experience is:

QR → WhatsApp

The tenant does not need to download an application just to report a maintenance issue.

The WhatsApp agent should collect:

identity

phone

name

unit

issue

location

category

urgency

photos

videos where supported

The backend converts the conversation into a structured maintenance request.

WhatsApp is the interface.

CivicFix is the system of record.

Do not rebuild an existing WhatsApp system if one already exists.

Integrate it with the CivicFix backend.

10. TENANT WEB EXPERIENCE

Tenants should also have an optional web/mobile experience.

They should be able to:

view submitted requests

see status

upload evidence

receive updates

view relevant maintenance history

access their apartment Passport information where permitted

Keep the tenant UI extremely simple.

11. MAINTENANCE REQUESTS

Every maintenance request should contain:

requester

property

building

unit

location

asset if applicable

description

category

urgency

timestamps

original evidence

status

assigned worker

work order

completion evidence

verification

Examples:

plumbing

electrical

HVAC

security

lift

structural

cleaning

appliances

water

lighting

access control

other

12. MAINTENANCE WORKFLOW

Use a proper lifecycle:

REQUESTED

↓

REVIEWED

↓

ASSIGNED

↓

ACCEPTED

↓

IN_PROGRESS

↓

COMPLETED

↓

VERIFIED

↓

CLOSED

Preserve event history.

Do not rely only on one mutable status field.

Record events such as:

maintenance.work_order_created

maintenance.assigned

maintenance.accepted

maintenance.in_progress

maintenance.completed

maintenance.verified

maintenance.closed

The history must tell us:

WHO did WHAT, WHEN, WHERE, and with WHAT evidence.

13. EVIDENCE SYSTEM

Evidence is a major CivicFix differentiator.

Preserve different evidence stages.

Reported issue

tenant description

original photos

videos

timestamp

Contractor result

completion photos

description

materials

invoice

timestamp

Verification

inspection

manager approval

verification photo

notes

timestamp

Never overwrite original evidence.

The system should preserve the chain of events.

14. MANAGER DASHBOARD

The manager dashboard should be the operational command center.

It should immediately answer:

What needs attention?

new requests

urgent issues

overdue work

unassigned work

pending approvals

What is happening?

assigned

accepted

in progress

What was completed?

completed

awaiting verification

verified

What keeps breaking?

recurring plumbing issues

recurring electrical issues

recurring assets

recurring locations

What is the property's history?

Direct access to Passport.

15. MANAGER REQUEST SCREEN

This is one of the most important screens.

Example:

LEAKING PIPE

Property: CivicFix Apartments
Unit: B-204
Location: Kitchen
Reported: 10:32 AM
Reported by: Tenant
Urgency: High

Evidence:

[photos]

Then:

WHAT SHOULD HAPPEN?

Assign caretaker

Assign existing fundi

Find contractor

Request expert

The manager should be able to make this decision quickly.

16. FUNDIs / CONTRACTORS

A fundi is a first-class operational entity.

Store:

name

phone

trade

category

properties served

jobs

acceptance rate

completion rate

ratings

evidence

history

payment history where applicable

Managers should be able to maintain a list of trusted fundis.

Example:

CivicFix Apartments

Preferred:

John — Plumber

Peter — Electrician

Mary — Cleaner

David — HVAC

17. FUNDI EXPERIENCE

Initially support:

App fundi

job list

job details

accept

decline

status

navigation

evidence

completion

earnings

WhatsApp fundi

job notification

issue

property

location

basic contact information where authorized

accept/decline

completion evidence

SMS can be added later.

Do not make SMS a V1 dependency.

18. FUNDI ONBOARDING

Managers should be able to:

Invite fundi

Enter:

name

phone

trade

Send invitation.

The fundi becomes associated with the property.

Do not build an open marketplace initially.

The first version should focus on trusted fundis already used by the property.

19. FUNDIs PASSPORT

Every fundi should gradually build a professional history.

For example:

John — Plumber

CivicFix history:

83 jobs

78 completed

4.8 average rating

95% acceptance

properties served

common job categories

This can eventually become the foundation for a marketplace.

But the marketplace is later.

20. PROPERTY OPERATIONS FEATURES INSPIRED BY MATURE PMS SYSTEMS

CivicFix should eventually have the depth expected from a serious property-management system.

Include architecture for:

Portfolio management

organizations

portfolios

properties

buildings

units

Occupancy

tenants

occupants

historical residents

vacancies

Lease management

leases

renewals

expiry

documents

Maintenance

requests

work orders

assignments

vendors

evidence

verification

SLAs

Assets

asset register

location

category

installation

maintenance history

replacement

Documents

leases

invoices

inspections

maintenance documents

certificates

Communications

tenant communication

work notifications

manager notifications

Reporting

maintenance KPIs

costs

recurring issues

response times

completion times

occupancy

property history

Owner reporting

Owners should eventually see:

portfolio

property performance

maintenance

costs

major issues

Passport

21. ASSET MANAGEMENT

Every important physical asset can eventually have its own identity.

Examples:

water pump

generator

lift

HVAC

electrical panel

gate

CCTV system

fire equipment

boiler

water tank

Asset record:

Asset → Location → Maintenance history → Evidence → Contractor → Cost → Replacement

This connects CivicFix's physical-building philosophy with professional facility management.

22. SLAs

Eventually support configurable maintenance SLAs.

Example:

Emergency

Response:
30 minutes

High

Response:
2 hours

Normal

Response:
24 hours

Track:

response time

assignment time

acceptance time

completion time

verification time

Show overdue work clearly.

Do not make an enormous SLA engine before the basic workflow works.

23. PAYMENTS

Payments are part of the long-term CivicFix vision, not the first thing to build.

Eventually support:

rent

maintenance fees

service charges

contractor payments

invoices

reconciliation

However:

Do not build an unlicensed CivicFix wallet.

Initially use regulated payment partners/APIs where appropriate.

CivicFix should not hold customer funds merely to create a financial feature.

Payments should be introduced only after the maintenance workflow is proven.

24. MARKETPLACE

The eventual vision includes a CivicFix maintenance network.

Managers could eventually:

Find a plumber near this property.

CivicFix could use verified historical performance.

However:

DO NOT build the open marketplace into V1.

First build:

Property → Trusted fundi → Jobs → Evidence → Performance history

Then use that data to determine whether a marketplace is actually valuable.

25. PROPERTY OWNER EXPERIENCE

Owners should eventually have an owner portal.

They can see:

properties

units

occupancy

maintenance

costs

major incidents

contractor history

Passport

An owner should be able to ask:

"What happened to my building this year?"

and get an understandable answer.

26. TENANT PASSPORT VS PROPERTY PASSPORT

Keep these concepts distinct.

Property Passport

The long-term history of the physical property.

Tenant history

The historical occupancy record.

Tenant maintenance history

The maintenance issues associated with that tenant/unit during their occupancy.

Do not expose a complete property history to an ordinary tenant if it contains information about other tenants.

Privacy boundaries must remain clear.

27. PRIVACY

Tenant information is sensitive operational data.

Use:

authentication

RLS

role-based access

property membership

least privilege

audit logs

Never expose:

another tenant's phone number

another tenant's private information

unrestricted tenant history

sensitive owner information

A tenant should see what they are authorized to see.

A manager can see their property's operational records.

An owner can see their property's authorized records.

An administrator has controlled elevated access.

28. SECURITY

Do not weaken security to make features work.

Never:

disable RLS

expose service-role keys

put secrets in client code

bypass authorization

expose tenant data publicly

delete historical audit records unnecessarily

Use the existing Supabase security model.

Reuse existing RLS.

If changing RLS, explain why and test it.

29. DATABASE PRINCIPLES

The existing database is important.

Do not casually:

drop tables

rename working tables

delete records

replace working RLS

duplicate existing concepts

Before creating something:

Check whether CivicFix already has it.

Reuse existing tables, views, functions, components and utilities whenever possible.

30. DASHBOARD DESIGN

The UI should feel like a serious modern property operations platform.

Take inspiration from the depth and structure of mature systems such as Goyzer, but do not clone its interface.

CivicFix should have:

Left navigation

Overview

Properties

Units

Tenants

Maintenance

Work Orders

Fundis

Assets

Documents

Passport

Payments

Reports

Settings

Role-specific navigation should hide irrelevant areas.

31. DASHBOARD OVERVIEW

The homepage should show useful operational information, not decorative statistics.

Example:

Portfolio

12 Properties
1,284 Units
1,146 Occupied

Maintenance

23 Open
6 Urgent
4 Overdue
17 In Progress

This Month

142 Requests
129 Completed
91% On-time

Recurring

Water pump — Building A
Electrical — Block C
Plumbing — Units B204/B205

The numbers must come from real database data.

Do not fabricate statistics.

32. PROPERTY PAGE

A property page should become the central operational hub.

Example:

CivicFix Apartments

Tabs:

Overview

Buildings

Units

Tenants

Maintenance

Assets

Fundis

Documents

Passport

Reports

Settings

This should make the property feel like a living digital representation of the physical building.

33. UNIT PAGE

Example:

Unit B-204

Current tenant:

Tenant D

Occupancy:

2025 → Present

Maintenance

12 requests

10 completed

2 open

Assets

Sink
Water heater
AC

History

Previous tenants

Passport

Unit maintenance timeline

Documents

Lease / relevant documents

Export

Export authorized records as CSV.

34. MAINTENANCE TIMELINE

Every property and unit should have a chronological timeline.

Example:

15 Aug 2026

Kitchen sink leak reported.

↓

Tenant evidence uploaded.

↓

Manager assigned John — Plumber.

↓

John accepted.

↓

Repair completed.

↓

Completion evidence uploaded.

↓

Manager verified.

↓

Job closed.

This is the heart of the CivicFix record.

35. SEARCH

Build strong global search eventually.

Search:

property

building

unit

tenant

fundi

work order

asset

Passport event

Example:

Search:

B-204

should immediately find:

unit

tenant

maintenance

assets

Passport

36. REPORTING

Eventually provide:

Maintenance reports

open requests

completion rate

average resolution time

recurring problems

cost

Property reports

maintenance history

asset health

occupancy

Tenant reports

occupancy history

authorized tenant records

Fundi reports

jobs

acceptance

completion

ratings

Passport reports

Exportable property history.

CSV must be supported.

37. NOTIFICATIONS

Support notification architecture for:

new maintenance request

assignment

acceptance

work started

completion

verification

overdue work

tenant updates

Channels can include:

in-app

WhatsApp

email

SMS later

Do not hard-code the system around one notification provider.

38. WHATSAPP ARCHITECTURE

The existing WhatsApp agent should be treated as a CivicFix interface.

The architecture should look like:

WhatsApp

↓

CivicFix conversational layer

↓

Structured CivicFix API

↓

Supabase

↓

Maintenance request

The WhatsApp layer should not become a separate database.

CivicFix remains the source of truth.

39. FUTURE AI

AI should be useful, not decorative.

Potential future capabilities:

classify maintenance issue

identify urgency

summarize tenant reports

suggest trade/category

detect duplicate reports

summarize property history

summarize recurring issues

help managers find information

generate property reports

Example:

"There have been 7 plumbing reports in Block B in the last 90 days."

But do not build expensive AI features before the core workflow is working.

40. WHAT CIVICFIX SHOULD NOT BECOME

Do not turn CivicFix into:

social media

tenant community chat

cryptocurrency platform

blockchain project

giant AI experiment

generic CRM

generic accounting system

giant open marketplace on day one

Every feature should support:

property operations, maintenance accountability, or property history.

41. V1 PRIORITY

The immediate product should be:

CORE

Property

→ Unit

→ Tenant

→ QR

→ WhatsApp

→ Maintenance Request

→ Manager

→ Fundi

→ Evidence

→ Verification

→ Passport

This is the killer loop.

Make this excellent before adding everything else.

42. V2

After the core loop is stable:

richer PMS

leases

asset management

SLAs

owner portal

advanced reporting

Daraja/payment integrations

richer fundi tools

SMS if data proves necessary

43. V3

Only after sufficient operational data:

fundi marketplace

contractor discovery

predictive maintenance

advanced analytics

insurance integrations

financing

transaction/property-sale integrations

advanced property intelligence

44. CURRENT TECHNICAL FOUNDATION

Use:

Next.js

TypeScript

Supabase

PostgreSQL

Supabase Auth

RLS

Existing database concepts include:

profiles

properties

property memberships

units

tenant relationships

maintenance requests

work orders

assignments

events

evidence

contractors/fundis

payments

Passport

tenant history

QR codes

Preserve the existing implementation.

45. CURRENT AUTHENTICATION ISSUE

There has been a login issue where valid credentials succeed but the application remains on /login.

Supabase authentication itself has been verified as successful.

Investigate the Next.js layer:

login page

Supabase browser client

AuthProvider

session persistence

auth listener

profile loading

membership loading

role detection

router navigation

dashboard authentication guard

middleware

Find the root cause.

Do not bypass authentication.

46. DEVELOPMENT RULES

You are an engineering partner.

Before making significant changes:

Inspect existing implementation.

Inspect database schema.

Inspect existing RLS.

Reuse existing components.

Avoid duplicate systems.

Make the smallest correct change.

Preserve data.

Test changes.

Run typecheck.

Run lint.

Run production build.

Never claim something works unless you actually tested it.

47. PRODUCT QUALITY BAR

CivicFix should eventually feel like:

Goyzer-level property-management depth

WhatsApp-native maintenance

physical QR building identity

evidence-backed accountability

persistent tenant and property history

Property Passport

event-based operational history

eventual maintenance network

The goal is not to clone Goyzer.

The goal is to take the serious operational capabilities we liked from mature PMS platforms and combine them with what makes CivicFix fundamentally different.

48. THE CIVICFIX MOAT

The long-term thesis is:

CivicFix creates a persistent, evidence-backed operational history for physical properties.

The QR creates the physical entry point.

WhatsApp removes reporting friction.

The PMS manages operations.

The evidence layer creates accountability.

The event history creates the audit trail.

Tenant history preserves occupancy history.

The Passport creates the permanent property record.

Fundi history creates trusted maintenance supply.

Payments eventually create financial infrastructure.

Over time, CivicFix becomes more than a maintenance app.

It becomes:

the operational memory of the building.

49. FINAL USER EXPERIENCE

Imagine a tenant at CivicFix Apartments.

They see:

CIVICFIX

REPORT A PROBLEM

QR code.

They scan.

WhatsApp opens.

They say:

"The bathroom sink is leaking."

CivicFix already knows:

Property: CivicFix Apartments
Building: Block B
Unit: B-204
Location: Bathroom

The tenant sends a photo.

CivicFix creates:

Maintenance Request #CF-000482

The manager receives it.

Manager sees:

Bathroom sink leak
B-204
Photo attached
Reported 10:32 AM
Tenant verified

Manager clicks:

Assign John — Plumber

John receives the job.

John accepts.

John completes the repair.

John uploads evidence.

Manager verifies.

The job closes.

The Passport automatically records:

15 Aug 2026 — Bathroom sink leak repaired — John Plumbing — Verified

Ten years later, an authorized owner can still see that event.

And the tenant history can show who occupied B-204 during the relevant period.

That is CivicFix.

50. MOST IMPORTANT INSTRUCTION

Do not lose the plot.

CivicFix is not trying to win by having the largest number of features.

The strategy is:

Start with the physical building.

Make maintenance incredibly easy.

Make every repair accountable.

Preserve the history.

Build the serious PMS capabilities around that foundation.

Let the Passport and network emerge from actual operations.

Every feature should strengthen one of these:

OBSERVABILITY

ACCOUNTABILITY

OPERATIONS

PROPERTY HISTORY

If a feature does not materially strengthen one of those, deprioritize it.

LOVABLE'S FIRST JOB

Before building new modules, inspect the existing CivicFix application and database.

Create a concise implementation audit showing:

What already exists.

What works.

What is partially implemented.

What is missing.

What should be reused.

What should be fixed.

What should be built next.

Then prioritize:

P0 — Authentication and core stability

P1 — Property → Unit → Tenant → QR → WhatsApp → Maintenance

P2 — Manager operations + Fundi workflow + evidence + verification

P3 — Passport + tenant history + CSV exports

P4 — PMS depth: leases, assets, documents, SLAs, reporting

P5 — Payments

P6 — SMS

P7 — Marketplace

P8 — Advanced AI / predictive maintenance

Do not rebuild the entire application in one pass.

Work incrementally, preserve the existing Supabase architecture and data, and make CivicFix progressively evolve into the final product described above.