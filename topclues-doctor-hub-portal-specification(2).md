# Topclues Doctor Hub

## Client Portal Product Specification

**Tagline:** Your Complete Digital Growth Dashboard  
**Prepared for:** Topclues Solutions  
**Document type:** Product and functional specification  
**Version:** 1.0  
**Status:** Proposed  
**Last updated:** 23 July 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Identity](#2-product-identity)
3. [Product Goals](#3-product-goals)
4. [Users and Roles](#4-users-and-roles)
5. [Information Architecture](#5-information-architecture)
6. [Global Portal Layout](#6-global-portal-layout)
7. [Dashboard Specification](#7-dashboard-specification)
8. [Functional Modules](#8-functional-modules)
9. [Core User Workflows](#9-core-user-workflows)
10. [Status Language](#10-status-language)
11. [Integrations](#11-integrations)
12. [Core Data Entities](#12-core-data-entities)
13. [Cross-Functional Requirements](#13-cross-functional-requirements)
14. [MVP Scope](#14-mvp-scope)
15. [Recommended Future Enhancements](#15-recommended-future-enhancements)
16. [Success Metrics](#16-success-metrics)
17. [Recommended Delivery Sequence](#17-recommended-delivery-sequence)
18. [Decisions to Confirm Before Development](#18-decisions-to-confirm-before-development)
19. [Recommended First-Release Dashboard Layout](#19-recommended-first-release-dashboard-layout)
20. [Final Recommendation](#20-final-recommendation)

---

## 1. Executive Summary

Topclues Doctor Hub is a secure client portal for doctors and clinic teams who use Topclues Solutions for digital marketing, advertising, content production, lead generation, reporting, and related services.

The portal will give each client one place to:

- Review marketing performance and account activity.
- Maintain doctor and clinic profile information.
- View package details and service usage.
- Approve or request changes to content.
- Access content calendars and published assets.
- View and download monthly reports.
- Review, manage, and export leads.
- Monitor campaigns and connected social channels.
- Download invoices, receipts, and documents.
- View special client offers.
- Submit reviews and service feedback.
- Raise support tickets and contact the assigned account team.
- View meetings, notifications, and account settings.

The first release should focus on the highest-value workflows: secure access, an informative dashboard, profile and package visibility, content approval, reports, invoices, leads, social media summaries, feedback, offers, and support. Live integrations, online payments, advanced analytics, and automation can follow in later phases.

---

## 2. Product Identity

### 2.1 Recommended Name

**Topclues Doctor Hub**

### 2.2 Positioning

A client-facing growth dashboard that makes the relationship between Topclues Solutions, doctors, and clinic teams transparent, organized, and easy to manage.

### 2.3 Primary Value Proposition

Doctors should be able to understand what Topclues is doing for them, see measurable results, complete approvals, access business documents, and request help without searching through email, WhatsApp, shared drives, or spreadsheets.

---

## 3. Product Goals

### 3.1 Business Goals

- Improve client trust through transparent reporting and activity tracking.
- Reduce manual coordination through centralized approvals and downloads.
- Shorten content approval and change-request turnaround time.
- Give clients a clear view of package usage, performance, payments, and renewals.
- Improve lead follow-up visibility and campaign accountability.
- Increase review submissions, offer uptake, renewals, and service upgrades.
- Reduce repetitive support requests for invoices, reports, and documents.
- Create a scalable client-service system for Topclues account managers.

### 3.2 User Goals

- Quickly understand current marketing performance.
- Find the latest report, invoice, content item, or lead with minimal effort.
- Approve content or request a revision from any device.
- Know what is included in the active package and what remains this month.
- Contact the correct Topclues team member without searching for details.
- Receive timely alerts about approvals, payments, reports, campaigns, and renewals.
- Keep professional, clinic, and brand information accurate.

### 3.3 Product Principles

- **Simple first:** Important information should be understandable without marketing expertise.
- **Action-oriented:** Every alert or status should lead to a clear next action.
- **Transparent:** Clients should see current statuses, dates, owners, and progress.
- **Mobile-friendly:** Core workflows must work well on a phone.
- **Secure by design:** Sensitive client, patient-lead, financial, and account information must be protected.
- **No password sharing:** Social accounts should use approved authorization methods and never expose passwords.
- **Multilingual-ready:** The interface should be prepared for English, Gujarati, and Hindi.

---

## 4. Users and Roles

### 4.1 Doctor

The primary client and account owner.

Typical access:

- Dashboard and account summary.
- Doctor and clinic profile.
- Package details and service usage.
- Content approvals and content calendar.
- Reports, leads, campaigns, and social media summaries.
- Invoices, receipts, offers, reviews, documents, support, and meetings.
- Notification, language, security, and privacy settings.

### 4.2 Clinic Staff

A delegated user invited by the doctor or created by an authorized administrator.

Typical access:

- Leads and follow-up updates.
- Content review or approval when permission is granted.
- Selected documents.
- Meetings and support.
- Limited doctor or clinic profile updates.

Clinic staff should not see billing, sensitive settings, or all documents unless the doctor explicitly grants permission.

### 4.3 Agency Account Manager

The Topclues team member responsible for the client relationship.

Typical access:

- Assigned doctor accounts.
- Profiles, packages, content, calendars, reports, campaigns, and documents.
- Support tickets, meetings, and client communication history.
- Uploading reports, invoices, proposals, meeting notes, and campaign updates.
- Responding to feedback and tracking client actions.

The account manager should not be able to change global platform settings or view unrelated client accounts.

### 4.4 Super Admin

The platform administrator for Topclues Solutions.

Typical access:

- All client accounts and team members.
- Roles, permissions, packages, services, offers, and platform settings.
- Billing records, reports, templates, integrations, and audit logs.
- User activation, suspension, impersonation with audit logging, and data governance.

### 4.5 Recommended Permission Matrix

| Capability | Doctor | Clinic Staff | Account Manager | Super Admin |
|---|:---:|:---:|:---:|:---:|
| View own dashboard | Yes | Limited | Assigned clients | All clients |
| Update doctor or clinic profile | Yes | Optional | Yes | Yes |
| View package and usage | Yes | Optional | Yes | Yes |
| Approve content | Yes | Permission-based | Manage | Manage |
| View reports and campaigns | Yes | Optional | Yes | Yes |
| View and update leads | Yes | Yes | Yes | Yes |
| View invoices and receipts | Yes | No by default | Yes | Yes |
| Submit reviews and feedback | Yes | Optional | View/respond | Manage |
| Raise support tickets | Yes | Yes | Respond/manage | Manage |
| Manage users and permissions | Own staff | No | No | Yes |
| Manage global configuration | No | No | No | Yes |

Permission checks must be enforced on the server, not only hidden in the interface.

---

## 5. Information Architecture

### 5.1 Portal Structure

```text
Topclues Doctor Hub
├── Authentication
│   ├── Sign in
│   ├── Sign in with OTP
│   ├── Forgot password
│   ├── Reset password
│   └── Account recovery and support
├── Dashboard
├── My Profile
│   ├── Personal information
│   ├── Professional information
│   ├── Clinic or hospital information
│   ├── Services and working hours
│   └── Social media profiles
├── My Package
│   ├── Package summary
│   ├── Included services
│   ├── Usage tracker
│   └── Renewal information
├── Content
│   ├── Content Approval
│   └── Content Calendar
├── Monthly Reports
├── Leads
├── Campaigns
├── Social Media
├── Invoices & Payments
├── Special Offers
├── Reviews & Feedback
├── Documents
├── Support
├── Meetings
├── Notifications
├── Settings
│   ├── Account and security
│   ├── Team and permissions
│   ├── Notification preferences
│   ├── Language and time zone
│   └── Privacy and data requests
└── Logout
```

### 5.2 Recommended Sidebar Navigation

1. Dashboard
2. My Profile
3. My Package
4. Content Approval
5. Content Calendar
6. Monthly Reports
7. Leads
8. Campaigns
9. Social Media
10. Invoices & Payments
11. Special Offers
12. Reviews & Feedback
13. Documents
14. Support
15. Meetings
16. Notifications
17. Settings
18. Logout

On smaller screens, the sidebar should collapse into a menu. Notifications, support, and the profile menu should remain accessible from the top header.

---

## 6. Global Portal Layout

### 6.1 Top Header

The top header should contain:

- Doctor name and clinic name.
- Current page title or breadcrumb.
- Search, if included in the release.
- Notification icon with unread count.
- Help or support shortcut.
- Profile photo and account menu.
- Language selector when multilingual support is enabled.

### 6.2 Page Conventions

Every list page should use consistent patterns:

- Page title and a short explanation.
- Primary action in a predictable location.
- Search, filters, sort, and date range where relevant.
- Status labels with consistent colors and wording.
- Empty, loading, success, and error states.
- Pagination or progressive loading for large datasets.
- Responsive tables that become cards or condensed rows on mobile.
- Last-updated time where data comes from an external platform.

### 6.3 Global Quick Actions

Recommended quick actions:

- View latest monthly report.
- Download latest invoice.
- Review pending content.
- Add or update a lead follow-up.
- Submit feedback.
- Contact the account manager.
- Raise a support ticket.
- View current offers.

---

## 7. Dashboard Specification

The dashboard is the default post-login destination. It should help the doctor answer three questions immediately:

1. What is happening now?
2. What requires my attention?
3. How is my marketing performing?

### 7.1 Welcome and Account Context

Example:

> Welcome, Dr. Jay Makadia. Here is an overview of your digital marketing activity for July 2026.

Display:

- Doctor and clinic name.
- Active package.
- Reporting period.
- Last data refresh time.
- Assigned account manager.

### 7.2 Primary Summary Cards

Recommended first row:

- Active package and renewal date.
- Leads generated this month.
- Content items pending approval.
- Outstanding payment.

Optional additional cards:

- Posts published this month.
- Total reach.
- Appointments booked.
- Open support requests.
- Package services remaining.

Each card should include a current value, short context, status or change indicator, and a link to the relevant module.

### 7.3 Quick Actions

- View monthly report.
- Download invoice.
- Approve content.
- View or update leads.
- Submit a review.
- Contact the account manager.
- View special offers.

### 7.4 Performance Overview

Display a date-filtered chart with selected metrics:

- Reach.
- Impressions.
- Engagement.
- Followers gained.
- Profile visits.
- Website clicks.
- WhatsApp clicks.
- Leads generated.
- Cost per lead.
- Ad spend.

Users should be able to switch between relevant time periods and platforms. Data must clearly show whether it is live, periodically synchronized, or manually uploaded.

### 7.5 Lead Performance

Display:

- Total leads.
- New leads.
- Contacted leads.
- Appointments booked.
- Converted leads.
- Conversion rate.
- Lead trend over time.
- Breakdown by source, service, or campaign.

### 7.6 Pending Content Approvals

Show a limited list of the most urgent items:

- Creative thumbnail.
- Content title or topic.
- Platform and content type.
- Planned publishing date.
- Approval deadline.
- Current status.
- Approve and review actions.

### 7.7 Recent Invoices and Latest Reports

Recent invoices should show invoice number, month, amount, due date, payment status, and download action.

Latest reports should show report month, report type, generated date, and view or download action.

### 7.8 Instagram Feed

When a supported connection is available, show recent Instagram content:

- Post preview.
- Caption excerpt.
- Likes and comments.
- Reach and engagement when available.
- Publishing date.
- Link to the original post.

If live data is unavailable, show a clearly labeled manually curated or last-synchronized feed.

### 7.9 Special Offers

Show one or more relevant offers with:

- Offer title.
- Short benefit statement.
- Offer price or discount.
- Expiry date.
- Claim or learn-more action.

### 7.10 Account Manager and Support

Display:

- Account manager name and photo.
- Role and working hours.
- Phone, WhatsApp, and email actions.
- Next scheduled meeting.
- Open ticket count and latest ticket status.

---

## 8. Functional Modules

### 8.1 Authentication and Account Access

#### Purpose

Provide secure, simple access for doctors, clinic staff, and Topclues team members.

#### Features

- Sign in with registered email address or mobile number and password.
- Sign in with one-time password.
- Remember me on trusted devices.
- Forgot-password and password-reset flow.
- Account activation and invitation flow.
- Account lockout or throttling after repeated failed attempts.
- Optional two-factor authentication.
- Logout from the current device or all devices.
- Contact-support shortcut.
- Links to privacy policy and terms and conditions.

#### Security Requirements

- OTPs must expire and be single-use.
- Passwords must never be stored or transmitted in plain text.
- Sensitive sessions should expire after inactivity.
- Login, logout, recovery, and permission changes should be auditable.
- Generic error messages should avoid revealing whether an account exists.

---

### 8.2 My Profile

#### Purpose

Maintain the information Topclues needs for marketing, reporting, billing, and client communication.

#### Personal Information

- Doctor name.
- Profile photo.
- Mobile number.
- Email address.
- Date of birth.
- Gender.
- Preferred language.

#### Professional Information

- Qualifications.
- Specialization.
- Medical registration number.
- Years of experience.
- Languages spoken.
- Consultation fees.
- Professional biography.
- Services and treatments offered.

#### Clinic or Hospital Information

- Clinic or hospital name.
- Logo.
- Address.
- Google Maps location.
- Primary contact number.
- WhatsApp number.
- Email address.
- Website.
- Working hours.
- Emergency contact number.

#### Social Media Profiles

- Facebook.
- Instagram.
- YouTube.
- LinkedIn.
- Google Business Profile.
- X.

#### Actions and Rules

- View and edit permitted fields.
- Upload or replace profile and clinic images.
- Preview how profile information may appear in marketing assets.
- Submit sensitive changes for verification when required.
- Display completeness percentage and missing required fields.
- Maintain a visible history of important profile changes for agency users.

---

### 8.3 My Package

#### Purpose

Explain the client’s commercial plan, included services, usage, and renewal status.

#### Package Information

- Package name.
- Package status.
- Start and end dates.
- Monthly fee.
- Billing frequency.
- Payment type.
- Next renewal date.
- Assigned account manager.

#### Included Services

Examples:

- Static social media posts.
- Carousels.
- Reels.
- Video shoots.
- Blog posts.
- Meta Ads management.
- Google Ads management.
- Google Business Profile management.
- Social scheduling and publishing.
- Monthly performance reporting.

#### Usage Tracker

| Service | Included | Completed | In Progress | Remaining |
|---|---:|---:|---:|---:|
| Static posts | 10 | 7 | 1 | 2 |
| Reels | 2 | 1 | 1 | 0 |
| Video shoots | 1 | 1 | 0 | 0 |
| Blog posts | 4 | 2 | 1 | 1 |

#### Actions and Rules

- View package inclusions and exclusions.
- See the applicable service period.
- View renewal or expiry warnings.
- Request an upgrade, add-on, or renewal.
- Contact the account manager about package questions.
- Prevent negative remaining quantities and define how unused services roll over.

---

### 8.4 Content Approval

#### Purpose

Centralize review, approval, revision requests, and final content delivery.

#### Categories

- Pending approval.
- Approved.
- Changes requested.
- Scheduled.
- Published.
- Archived.

#### Content Card or Detail View

- Creative or video preview.
- Content title or topic.
- Caption and hashtags.
- Platform.
- Content type.
- Language.
- Planned publishing date and time.
- Approval deadline.
- Assigned Topclues team member.
- Current status and history.
- Version number.
- Comments and attachments.
- Published-post link when available.

#### Actions

- Approve.
- Request changes.
- Add a comment.
- Reply to a comment.
- Download creative or video.
- Compare current and previous versions.
- View the final published post.

#### Recommended Status Workflow

```text
Draft
  → Internal Review
  → Pending Doctor Approval
    → Approved
      → Scheduled
        → Published
    → Changes Requested
      → Revised
        → Pending Doctor Approval
```

#### Rules

- Approval and change requests must record user, date, time, and version.
- A change request should require a clear comment.
- A revised version should not overwrite the previously reviewed version.
- Publishing should use only the approved version.
- Urgent or overdue approvals should be highlighted and may trigger reminders.
- Clinic staff approval must be permission-based.

---

### 8.5 Content Calendar

#### Purpose

Show planned, approved, scheduled, and published content in a calendar or list.

#### Display

- Publishing date and time.
- Platform.
- Content topic.
- Content type.
- Language.
- Approval status.
- Publishing status.
- Assigned owner.

#### Filters

- Date range.
- Facebook, Instagram, YouTube, LinkedIn, Google Business Profile, or X.
- Static post, carousel, reel, video, story, blog, or festival post.
- Approval status.
- Publishing status.

#### Actions

- Open content details.
- Approve or request changes when authorized.
- Download an asset.
- Export or print the calendar.
- View month, week, or list format.

Drag-and-drop rescheduling should be restricted to authorized Topclues users unless client rescheduling is explicitly enabled.

---

### 8.6 Monthly Reports

#### Purpose

Provide a consistent archive of marketing and campaign performance reports.

#### Report Types

- Social media performance.
- Meta Ads.
- Google Ads.
- Lead generation.
- Website analytics.
- Google Business Profile.
- SEO.
- Video performance.
- Combined monthly performance.

#### Report Record

- Report title.
- Reporting month or custom period.
- Report type.
- Date generated.
- Generated or uploaded by.
- Short summary.
- File size and version.
- View, download, or share action.

#### Performance Summary

Where structured data is available, display:

- Reach and impressions.
- Engagement and engagement rate.
- Profile visits.
- Followers gained.
- Website and WhatsApp clicks.
- Leads generated.
- Cost per lead.
- Ad spend.
- Top-performing content.
- Month-over-month change.

#### Actions and Rules

- View the report in the portal.
- Download a PDF.
- Filter by period or report type.
- Share a secure link where permitted.
- Notify clients when a new report is available.
- Keep previous reports immutable or versioned.
- Display source and last-refresh information for metrics.

---

### 8.7 Invoices and Payments

#### Purpose

Give clients a reliable billing record and simple access to financial documents.

#### Invoice List

- Invoice number.
- Billing period.
- Invoice date.
- Due date.
- Subtotal.
- GST.
- Total amount.
- Amount paid and balance due.
- Payment status.
- Download action.

#### Payment Statuses

- Paid.
- Pending.
- Partially paid.
- Overdue.
- Cancelled.
- Refunded, if supported.

#### Actions

- View or download invoice.
- Download payment receipt.
- View payment history.
- Pay online when enabled.
- Upload payment proof.
- Request payment confirmation.
- Contact billing support.

#### Billing Information

- Legal name and billing address.
- GST details.
- Topclues PAN and GST number.
- Bank or payment instructions.

Financial documents should remain read-only for clients after issue. Corrections should create a revised document or credit note instead of silently changing the original.

---

### 8.8 Leads Management

#### Purpose

Allow doctors and clinic teams to review marketing leads, track follow-up, and measure outcomes.

#### Lead Record

- Patient or prospect name.
- Mobile number.
- Interested service.
- Location.
- Lead source.
- Received date and time.
- Campaign name.
- Assigned staff member.
- Follow-up status.
- Next follow-up date.
- Remarks and follow-up history.

#### Lead Statuses

- New.
- Contacted.
- Appointment booked.
- Follow-up required.
- Converted.
- Not interested.
- Invalid.
- Duplicate.

#### Features

- Search leads.
- Filter by date, status, service, source, campaign, or assignee.
- Sort by newest, oldest, or next follow-up.
- Update lead status.
- Add a time-stamped follow-up note.
- Assign a lead to clinic staff.
- Initiate a call or WhatsApp conversation from a supported device.
- Download authorized records to CSV or Excel.
- Detect or flag likely duplicates.

#### Summary

- Total leads.
- New and contacted leads.
- Appointments booked.
- Converted leads.
- Conversion rate.
- Source and campaign breakdown.
- Average response time when measurable.

#### Privacy Rules

- Store only the minimum necessary lead information.
- Limit access to authorized users.
- Log exports and sensitive record access.
- Define retention and deletion rules.
- Do not present unverified marketing leads as clinical patient records.

---

### 8.9 Social Media Overview

#### Purpose

Provide a consolidated view of connected channels and recent content performance.

#### Supported Platforms

- Facebook.
- Instagram.
- YouTube.
- LinkedIn.
- Google Business Profile.
- X.

#### Platform Summary

- Connection or synchronization status.
- Followers or subscribers.
- Reach and impressions.
- Engagement and engagement rate.
- Profile visits.
- Published posts.
- Follower growth.
- Best-performing post or video.
- Last synchronized time.

#### Instagram Feed

- Post preview.
- Caption excerpt.
- Likes and comments.
- Reach and engagement when available.
- Published date.
- Link to Instagram.

#### Security

Social media passwords must never be displayed or stored in the portal. Connections should use official APIs, delegated Meta Business Portfolio access, or another secure authorization method. Tokens and permissions should be encrypted, limited, monitored, and revocable.

---

### 8.10 Campaigns

#### Purpose

Show what campaigns are running, what they are intended to achieve, and how they are performing.

#### Campaign Record

- Campaign name.
- Platform.
- Objective.
- Start and end dates.
- Budget.
- Spend.
- Leads or primary result.
- Cost per lead or primary result.
- Status.
- Assigned manager.
- Related report or landing page.

#### Campaign Types

- Meta lead generation.
- WhatsApp campaign.
- Website traffic.
- Google Search Ads.
- Awareness.
- Video views.

#### Statuses

- Draft.
- Scheduled.
- Active.
- Paused.
- Completed.
- Cancelled.

#### Actions

- View campaign details.
- View performance trend.
- Download or open a related report.
- Ask the account manager a question.
- Submit a campaign request.

Clients should not directly change live budget, targeting, or campaign status in the initial release unless Topclues establishes an approval workflow and safeguards.

---

### 8.11 Special Offers

#### Purpose

Present relevant upgrades, add-ons, seasonal campaigns, and loyalty offers.

#### Offer Card

- Offer title.
- Short description and benefits.
- Regular price.
- Offer price.
- Discount percentage.
- Validity period.
- Eligibility.
- Terms and conditions.
- Claim-offer action.

#### Example Offers

- Additional reel package.
- Video shoot.
- Website development discount.
- Google Ads setup.
- Festival campaign package.
- Annual contract discount.
- Personal branding package.

#### Rules

- Show only active and eligible offers.
- Record the client’s interest or claim.
- Notify the assigned account manager.
- Make it clear when claiming an offer is an enquiry rather than an immediate purchase.

---

### 8.12 Reviews and Feedback

#### Purpose

Collect structured service feedback and make it easy for satisfied clients to publish reviews.

#### Review Form

- Rating.
- Review title.
- Review message.
- Service selected.
- Optional profile photo.
- Optional video testimonial.
- Permission to publish.
- Consent acknowledgement.

#### Service Feedback Areas

- Content quality.
- Communication.
- Reporting.
- Lead quality.
- Video production.
- Timeliness.
- Overall experience.

#### External Review Shortcuts

- Google review.
- Facebook review.
- Website testimonial.
- Video testimonial.

#### Rules

- External buttons should open the correct verified review destination.
- Publication permission must be explicit and revocable subject to applicable terms.
- Internal service feedback should not automatically become a public testimonial.
- Topclues users should be able to mark feedback for follow-up without modifying the original client response.

---

### 8.13 Support and Help Desk

#### Purpose

Create a trackable support channel for requests, questions, and issues.

#### New Ticket Form

- Subject.
- Category.
- Priority.
- Description.
- Attachment.
- Related module, content item, invoice, campaign, or lead when applicable.

#### Categories

- Content change.
- Social media.
- Advertising.
- Billing.
- Website.
- Leads.
- Reports.
- Account access.
- Other.

#### Statuses

- Open.
- In progress.
- Waiting for client.
- Resolved.
- Closed.

#### Features

- Ticket number and status history.
- Conversation thread.
- Attachments.
- Assigned team member.
- Created and last-updated times.
- Expected response time.
- Reopen action within a defined period.
- Satisfaction rating after resolution.

#### Assigned Team Contact

- Account manager.
- Project coordinator.
- Phone and WhatsApp.
- Email.
- Working hours.
- Emergency or escalation instructions, if offered.

---

### 8.14 Documents

#### Purpose

Provide a structured, permission-controlled document library.

#### Doctor or Clinic Documents

- Profile photos.
- Qualification certificates.
- Medical registration certificate.
- Clinic logo and clinic photos.
- Treatment or service photos.
- Service list.
- Price list.
- Brand guidelines.

#### Agency Documents

- Proposal.
- Agreement.
- Invoice and receipt.
- Monthly report.
- Content calendar.
- Campaign plan.
- Meeting notes.

#### Features and Rules

- Folder or category view.
- Search and filters.
- Preview and download.
- Upload with file-type and size validation.
- Version history.
- Expiry or renewal date for relevant certificates.
- Permission-based access.
- Malware scanning and safe file handling.
- Clear distinction between final, draft, expired, and archived files.

---

### 8.15 Notifications

#### Purpose

Alert users to time-sensitive updates and requested actions.

#### Notification Types

- Content ready for approval.
- Approval deadline approaching.
- Monthly report available.
- Invoice generated.
- Payment due or overdue.
- New lead received.
- Follow-up due.
- Campaign started, paused, or completed.
- Special offer available or expiring.
- Support ticket updated.
- Meeting scheduled or changed.
- Package renewal or expiry reminder.
- Security or account change.

#### Delivery Channels

- In-portal notification.
- Email.
- WhatsApp.
- SMS.

#### Features

- Unread count.
- Mark as read or unread.
- Mark all as read.
- Link directly to the related item.
- Notification preferences by category and channel.
- Quiet hours and frequency controls where supported.

Mandatory security or account notices should not be fully disabled.

---

### 8.16 Meetings

#### Purpose

Keep client meetings, links, notes, and action items in one place.

#### Meeting Record

- Meeting title.
- Date, time, and time zone.
- Meeting type.
- Participants.
- Google Meet or other meeting link.
- Agenda.
- Meeting notes.
- Action items, owners, and due dates.
- Attachments.

#### Actions

- Request or schedule a meeting.
- Join meeting.
- Add to calendar.
- Request rescheduling.
- View upcoming and previous meetings.
- Acknowledge assigned action items.

Meeting creation and calendar integration should respect staff availability and avoid exposing private team calendars.

---

### 8.17 Settings

#### Account and Security

- Change password.
- Enable OTP or two-factor authentication.
- View and revoke active sessions.
- Update login email or mobile number with verification.

#### Team and Permissions

- Invite clinic staff.
- Activate or deactivate a clinic user.
- Assign module-level permissions.
- Review recent access.

#### Preferences

- English, Gujarati, or Hindi.
- Time zone.
- Date and number formats.
- Notification channels and categories.

#### Privacy

- Profile visibility.
- Connected-account permissions.
- Data download request.
- Account deletion request.
- Consent and policy history.

Account deletion should be a request and verification workflow, not an immediate one-click deletion, because legal, financial, and service records may have retention requirements.

---

## 9. Core User Workflows

### 9.1 First-Time Access

1. Topclues creates or imports the client account.
2. The doctor receives a secure invitation.
3. The doctor verifies the registered email address or mobile number.
4. The doctor creates a password or enables OTP access.
5. The doctor accepts the terms and privacy notice.
6. The portal requests missing profile and clinic information.
7. The doctor lands on the personalized dashboard.

### 9.2 Content Approval

1. Topclues uploads a creative, caption, platform, and proposed date.
2. The doctor receives a notification.
3. The doctor reviews the content and its current version.
4. The doctor approves it or requests changes with a comment.
5. If changes are requested, Topclues uploads a new version.
6. The doctor approves the revised version.
7. Topclues schedules and publishes the approved content.
8. The published link and final asset become available in the portal.

### 9.3 Monthly Reporting

1. Topclues generates or uploads the monthly report.
2. The portal records its period, type, version, and summary.
3. The doctor receives a notification.
4. The doctor views the headline metrics.
5. The doctor opens or downloads the full report.
6. The doctor can ask the account manager a report-related question.

### 9.4 Lead Follow-Up

1. A lead is created through an integration or manual entry.
2. The doctor or permitted clinic staff receives an alert.
3. The lead is assigned and contacted.
4. Staff records the outcome, note, and next follow-up.
5. The lead progresses to appointment booked, converted, not interested, invalid, or another final status.
6. Dashboard and campaign metrics update accordingly.

### 9.5 Invoice Access and Payment Confirmation

1. Topclues issues an invoice.
2. The doctor receives a notification.
3. The doctor views or downloads the invoice.
4. The doctor pays using the available method.
5. Payment is synchronized or confirmed by Topclues.
6. The invoice status changes and a receipt becomes available.

### 9.6 Support Request

1. The user selects a category and describes the issue.
2. The portal assigns a ticket number and appropriate owner.
3. Topclues acknowledges and responds.
4. The user and Topclues exchange messages or attachments.
5. The issue is resolved and closed.
6. The user can rate the support experience.

---

## 10. Status Language

Statuses should be short, consistent, and understandable. Color should support the label, not replace it.

| Meaning | Recommended Treatment |
|---|---|
| Needs user attention | Amber with a clear action |
| Successful or complete | Green |
| Informational or scheduled | Blue |
| Overdue, failed, or blocked | Red |
| Inactive, archived, or not applicable | Grey |

The same status should use the same wording and visual treatment everywhere in the portal.

---

## 11. Integrations

### 11.1 Recommended Integrations

- Meta APIs for supported Facebook and Instagram data.
- Google Ads.
- Google Analytics.
- Google Business Profile.
- YouTube.
- LinkedIn, when the required access and API capabilities are available.
- Payment gateway for online payments.
- Email, SMS, and WhatsApp messaging providers.
- Google Calendar and Google Meet or an equivalent meeting provider.
- Cloud object storage for documents, reports, images, and videos.

### 11.2 Integration Rules

- Use official APIs and supported authorization flows.
- Explain which data is live, delayed, manually entered, or unavailable.
- Store the minimum required permissions and tokens.
- Encrypt secrets and tokens.
- Handle expired permissions and disconnected accounts gracefully.
- Record synchronization time and errors.
- Allow an authorized administrator to reconnect or revoke an integration.
- Provide a manual upload or entry fallback for MVP workflows.

---

## 12. Core Data Entities

The implementation will likely require the following core records:

- User.
- Role and permission.
- Doctor profile.
- Clinic or hospital.
- Package.
- Service entitlement and usage.
- Content item.
- Content version.
- Approval, comment, and attachment.
- Content calendar event.
- Report.
- Invoice, payment, and receipt.
- Lead and follow-up.
- Campaign and performance snapshot.
- Social account and performance snapshot.
- Offer and offer claim.
- Review and feedback response.
- Support ticket and ticket message.
- Document and document version.
- Meeting and action item.
- Notification and delivery preference.
- Integration connection.
- Audit event.

Each record should have a stable identifier, owner or client account, creation and update timestamps, status, and access-control context.

---

## 13. Cross-Functional Requirements

### 13.1 Security and Privacy

- Encrypt traffic and sensitive stored data.
- Apply server-side role and account isolation.
- Use secure session, password, and OTP practices.
- Protect file uploads and downloads.
- Record security-sensitive and high-value actions in audit logs.
- Mask sensitive lead information where full access is unnecessary.
- Obtain explicit consent where testimonials, photos, or videos may be published.
- Define retention, export, correction, and deletion processes.
- Maintain backups and a tested recovery process.
- Perform security review and vulnerability testing before launch.

The portal should be treated as a marketing and client-service system, not an electronic medical record. It should avoid storing clinical notes, diagnoses, or unnecessary health information.

### 13.2 Accessibility

- Target WCAG 2.1 AA practices.
- Support keyboard navigation.
- Provide visible focus states.
- Use sufficient color contrast.
- Add meaningful labels and alternative text.
- Ensure forms provide clear validation and error recovery.
- Never communicate status through color alone.

### 13.3 Responsive Design

Core actions must work on desktop, tablet, and mobile:

- Login and OTP.
- Dashboard review.
- Content approval and change request.
- Lead follow-up.
- Invoice and report download.
- Support and account-manager contact.

### 13.4 Performance

Recommended targets for normal conditions:

- Useful page content visible within three seconds on a typical mobile connection.
- Immediate feedback after actions such as approval or status change.
- Lazy loading for media-heavy feeds, reports, and document previews.
- Background processing for large uploads and report generation.

### 13.5 Reliability and Recovery

- Prevent duplicate form submissions and repeated approvals.
- Preserve unsent comments where practical.
- Use idempotent processing for integration events.
- Display integration outages without making the whole portal unavailable.
- Back up critical records and test restoration.

### 13.6 Auditability

Audit at minimum:

- Sign-in and recovery events.
- Role and permission changes.
- Profile and package changes.
- Content approvals and revision requests.
- Lead exports.
- Invoice and payment-status changes.
- Document uploads, replacements, and deletions.
- Integration connection changes.
- Data export and account deletion requests.

### 13.7 Localization

- Prepare interface strings for translation.
- Support English first, followed by Gujarati and Hindi.
- Use the user’s selected time zone.
- Keep doctor names, clinic names, addresses, and user-provided content in their original language unless explicitly translated.
- Test layouts for longer translated labels.

---

## 14. MVP Scope

### 14.1 MVP Objective

Launch a secure and dependable portal that replaces the most common manual client-service interactions without depending on complex live integrations.

### 14.2 Included in MVP

1. **Authentication and OTP**
   - Email or mobile login, password reset, OTP, and secure sessions.

2. **Dashboard**
   - Package, leads, pending approvals, payment, latest reports, recent invoices, offers, and account-manager summary.

3. **Doctor and Clinic Profile**
   - View, edit, upload images, and show profile completeness.

4. **My Package**
   - Package summary, included services, usage, and renewal date.

5. **Content Approval**
   - Preview, caption, approval, change request, comments, download, status, and version history.

6. **Content Calendar**
   - Month and list view with platform, type, date, and status filters.

7. **Monthly Reports**
   - Report archive, summary metadata, in-browser viewing where possible, and PDF download.

8. **Invoices**
   - Invoice archive, payment status, and invoice or receipt download.

9. **Leads**
   - Lead list, filters, detail, assignment, status updates, notes, follow-up date, and authorized export.

10. **Social Media Overview**
    - Manually maintained or periodically imported account summary and recent-post links.

11. **Reviews and Feedback**
    - Structured internal feedback and verified external-review shortcuts.

12. **Special Offers**
    - Active offer list and enquiry or claim action.

13. **Support Tickets**
    - Ticket creation, thread, status, attachments, and assigned team contact.

14. **Notifications**
    - In-portal and email notices for critical MVP events.

15. **Basic Administration**
    - Client, user, package, content, report, invoice, lead, offer, and ticket management for Topclues.

### 14.3 MVP Data Approach

The MVP may combine:

- Manual administration.
- CSV import for leads or performance data.
- Secure uploads for reports, invoices, and documents.
- Simple links to published social posts.
- Selected API integrations only where stable and essential.

This reduces integration risk while validating the workflows clients use most.

### 14.4 Deferred from MVP

- Full live social media feeds and cross-platform analytics.
- Direct control of advertising campaigns.
- Online payments and automated reconciliation.
- Advanced meeting scheduling and calendar synchronization.
- WhatsApp and SMS notification automation.
- AI recommendations or content generation.
- Appointment and clinical practice management.
- Advanced document approval or e-signature.
- White-label and multi-agency support.

### 14.5 MVP Acceptance Criteria

The MVP is ready for pilot use when:

- A doctor can securely sign in and see only the correct account.
- A clinic staff member sees only granted modules.
- A doctor can approve or request changes to a content version.
- A doctor can view and download a monthly report and invoice.
- A permitted user can update a lead and add a follow-up note.
- Topclues can upload and manage content, reports, invoices, offers, and client records.
- Notifications link to the correct item.
- Critical actions are audited.
- Core workflows are usable on mobile.
- Access-control, backup, file-upload, and recovery testing has passed.

---

## 15. Recommended Future Enhancements

### Phase 2: Integrations and Automation

- Live Instagram and Facebook feed using approved Meta integrations.
- Automated Meta Ads, Google Ads, Analytics, and Business Profile metrics.
- Automated lead ingestion from forms, ads, landing pages, and CRM sources.
- Online payments, receipts, and payment reconciliation.
- WhatsApp and SMS notifications.
- Google Calendar and Meet integration.
- Scheduled report generation and email delivery.
- Automated approval reminders and escalation rules.
- Advanced campaign dashboards and downloadable analytics.
- Bulk lead assignment and follow-up reminders.

### Phase 3: Growth and Intelligence

- AI-generated monthly performance summaries.
- Trend, anomaly, and campaign pacing alerts.
- Content-performance recommendations.
- Lead scoring and conversion-probability indicators.
- Service upsell recommendations based on package use and goals.
- Client health score for Topclues account managers.
- Renewal forecasting and retention alerts.
- Benchmarking against the client’s own historical performance.
- Custom dashboards by specialty or package.

### Phase 4: Platform Expansion

- Appointment-request and clinic scheduling integrations.
- E-signature for proposals and agreements.
- Multi-clinic and multi-location management.
- White-label portal options.
- Native mobile application or progressive web app.
- Voice and video testimonials captured in the portal.
- Knowledge base and guided onboarding.
- Secure API and webhooks for partner systems.
- Advanced workflow builder for approvals, tickets, and campaign requests.

Future healthcare-related features should undergo a separate privacy, legal, security, and data-governance review before implementation.

---

## 16. Success Metrics

### Client Adoption

- Percentage of invited doctors who activate their account.
- Monthly active doctors and clinic staff.
- Percentage of clients returning each month.
- Mobile versus desktop usage.

### Workflow Efficiency

- Median time to content approval.
- Percentage of approvals completed before deadline.
- Number of reports and invoices accessed through the portal.
- Reduction in manual requests for reports, invoices, and status updates.
- Median support first-response and resolution time.

### Lead Outcomes

- Percentage of leads updated within the target response period.
- Appointment-booking and conversion rates.
- Percentage of leads with a complete follow-up history.

### Commercial Outcomes

- Renewal rate.
- Offer enquiry and conversion rate.
- Package upgrade rate.
- Overdue invoice rate.
- Client review and testimonial submission rate.

### Quality

- Failed login and account-recovery rate.
- Error rate for critical actions.
- Integration synchronization success.
- Accessibility and mobile usability results.
- Client satisfaction after support resolution.

---

## 17. Recommended Delivery Sequence

### Stage 1: Foundation

- Authentication, account model, roles, permissions, audit trail, profile, and administration.

### Stage 2: Core Client Value

- Dashboard, package, content approval, calendar, reports, and invoices.

### Stage 3: Growth Operations

- Leads, social overview, campaigns, offers, and reviews.

### Stage 4: Client Service

- Support, documents, notifications, meetings, and account settings.

### Stage 5: Integration and Optimization

- Live data connections, online payment, automation, performance tuning, and product analytics.

Pilot the MVP with a small group of doctors representing different packages and clinic sizes. Use the pilot to validate permissions, labels, mobile workflows, notification frequency, report usefulness, and lead follow-up behavior before a wider rollout.

---

## 18. Decisions to Confirm Before Development

- Whether the first release is web-only or a progressive web application.
- Whether doctors can invite clinic staff or only Topclues can create users.
- Which clinic-staff permissions are enabled by default.
- Which social and advertising integrations are essential for the pilot.
- Whether reports are uploaded PDFs, structured dashboards, or both.
- The system that owns invoice and payment truth.
- Whether leads are imported, entered manually, received by webhook, or synchronized from a CRM.
- The official status definitions and service-level targets for content and support.
- Whether unused package services expire or roll over.
- Supported file types, maximum file sizes, and retention periods.
- Which notification channels are available at launch.
- Whether Gujarati and Hindi are required at launch or prepared for a later phase.
- Legal wording for privacy, terms, consent, testimonials, data requests, and retention.
- Whether the portal will use the existing Topclues website identity or a dedicated Doctor Hub design system.

---

## 19. Recommended First-Release Dashboard Layout

```text
┌────────────────────────────────────────────────────────────────────┐
│ Header: Doctor · Clinic · Search · Alerts · Support · Profile      │
├────────────────────────────────────────────────────────────────────┤
│ Active Package │ Leads This Month │ Pending Approval │ Amount Due  │
├───────────────────────────────────┬────────────────────────────────┤
│ Marketing Performance            │ Lead Performance               │
├───────────────────────────────────┼────────────────────────────────┤
│ Pending Content Approvals         │ Latest Reports                 │
├───────────────────────────────────┼────────────────────────────────┤
│ Recent Invoices                   │ Special Offers                 │
├───────────────────────────────────┼────────────────────────────────┤
│ Recent Social Content             │ Account Manager & Support      │
└───────────────────────────────────┴────────────────────────────────┘
```

On mobile, these sections should appear as a single prioritized column: urgent actions, summary cards, quick actions, performance, reports and invoices, offers, and account support.

---

## 20. Final Recommendation

Build Topclues Doctor Hub as a focused client-service portal first, not as a complete marketing automation or clinic-management platform. The most important first-release experience is:

> Sign in securely, understand what is happening, complete the next action, and find every important client document in one place.

Once doctors and Topclues account managers consistently use the core workflows, live integrations and intelligent automation can be added with clearer evidence about which enhancements will deliver the greatest value.
