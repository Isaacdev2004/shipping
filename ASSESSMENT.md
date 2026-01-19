## 📌 Paid Technical Assessment – Full-Stack Developer

### Project Summary

We’re looking for a **skilled full-stack developer** to complete a **paid technical assessment project**. This is **real paid work**, not a hypothetical test. The goal is to evaluate your skills before a potential **long-term collaboration**.

If your submission meets our standards, we’ll discuss ongoing work opportunities.

💰 **You will be paid upon satisfactory completion**, regardless of whether we proceed with long-term collaboration.

---

## 🚀 About the Project

You will build a **Bulk Shipping Label Creation Platform** — a web application that allows users to:

1. Upload a spreadsheet containing shipping orders
2. Review, validate, and edit the imported data
3. Select shipping providers and services
4. Purchase and generate shipping labels in bulk

The application should follow a **3-step wizard flow**:

**Upload → Review & Edit → Select Shipping → Purchase**

### Provided Files

* **PRD Document (PRD.md)** – Detailed product requirements
* **Template.csv** – Sample CSV with 100 shipping records (includes intentionally incomplete data)

Please review both files carefully before submitting your proposal.

---

## 🤖 AI / LLM Tool Usage

You **ARE allowed** to use AI tools such as:

* ChatGPT
* Claude
* GitHub Copilot
* Cursor
* Any other productivity tools

We care about **results and code quality**, not whether you typed every line manually.
However, you **must understand and be able to explain your code** if asked.

---

## 🔍 What We’re Evaluating

1. **Creative Design & UX**

   * Clean visual hierarchy
   * Intuitive workflow
   * Thoughtful loading, error, and empty states

2. **Validation & Data Handling**

   * The CSV contains missing addresses, weights, and other data
   * Validation rules are **intentionally not defined**
   * You must decide:

     * What’s required
     * How errors are handled
     * How issues are communicated to users

3. **Code Quality**

   * Clean architecture
   * Maintainable and well-organized code
   * Proper error handling

4. **Problem Solving**

   * Handling ambiguity
   * Edge cases
   * Third-party API failures

---

## 🛠️ Required Tech Stack (Mandatory)

You **must** use the following stack:

### Backend

* **Python** (Django or FastAPI)
* REST API
* All validation and business logic must live here

### Frontend

* **React + TypeScript**

### Database

* PostgreSQL or SQLite

⚠️ **Important:**
All core logic must be implemented in the **Python backend**.
Frontend-only or logic-heavy frontend solutions will **not** be accepted.

---

## 📍 Address Validation Requirement (Important)

You must integrate a **real address validation API**, such as:

* USPS Address Validation API (free)
* Google Address Validation API
* Smarty (SmartyStreets)
* Lob Address Verification
* Or another reliable service

### Fallback Requirement

If one API fails or hits its free-tier limit, the system must automatically try an alternative.

This is a key part of the evaluation — we want to see how you design **resilient third-party integrations**.

---

## 📦 Deliverables

1. **Live Demo URL**

   * Hosted by you
   * Must remain live for **at least 2 weeks**

2. **Source Code**

   * Public GitHub repository **or** downloadable zip file

3. **README File**

   * Setup instructions
   * Assumptions made
   * Design and architectural decisions

❌ No video walkthroughs
✅ We need a **working live application** we can test ourselves

---

## 💰 Budget

* **Assessment Budget:** **$100 USD (fixed)**
* This is a **paid assessment task**.
* Payment will be made **upon satisfactory completion** of the assignment.
* Compensation is provided **regardless of whether we proceed with long-term collaboration**.

> The budget is fixed for this assessment and is not negotiable.

---

## ⏱️ Timeline

* **Deadline:** 3 days from project start

---

## 📝 How to Apply (Fiverr)

When you message us, please include:

1. A brief explanation of **how you would approach this project**
2. The **exact tech stack** you’ll use
3. Links to **1–2 similar projects** you’ve built
4. Your **estimated completion timeline**

⚠️ **Do not start development** until we confirm and accept your proposal.

---

## 🚫 No Calls or Meetings

We do **not** offer:

* Calls
* Video meetings
* Additional explanations

Everything required is included in the **PRD and Template.csv**.
This is intentional — part of the evaluation is your ability to:

* Understand written requirements
* Make reasonable assumptions
* Document decisions clearly in the README

If something is unclear, **make a reasonable assumption and document it**.

Developers who request meetings or clarification calls **will not be considered**.

---

## ⚠️ Important Assessment Notes (Please Read Carefully)

Before starting the task, please keep the following **critical evaluation criteria** in mind:

### 🔧 Backend Requirement (Mandatory)

* You **must use Django with Django REST Framework (DRF)** for the backend.
* This is **non-negotiable** and a key part of our technical evaluation.
* Submissions using FastAPI or other backend frameworks will **not be considered**.

---

### 📊 Logging (Highly Important)

* Implement **robust, structured logging** across the entire application flow, including:

  * CSV upload and parsing
  * Data validation and error handling
  * Address verification and fallback logic
  * Bulk actions (edit, delete, shipping selection, purchase)
* Logging quality has a **significant impact on scoring**.
* Logs should be clear, meaningful, and helpful for debugging and production monitoring.

---

### 🎨 UI / UX (Highest Priority)

* **UI/UX is the most heavily weighted part of this assessment.**
* We are looking for:

  * A modern, clean, and polished design
  * Strong visual hierarchy and spacing
  * Intuitive multi-step flow
  * Thoughtful states:

    * Loading
    * Validation errors
    * Empty states
    * Confirmations and success feedback
* This should feel like a **real production-ready product**, not a rough internal tool.

---

### 🧠 Product Mindset Matters

This assessment is evaluated as a **real product**, not just a functional demo.

We care deeply about:

* Attention to detail
* Product thinking
* Reasonable assumptions
* Clear UX decisions
* Well-documented trade-offs in the README

A solution that is **polished, thoughtful, and user-centric** will score significantly higher than one that is only technically correct.




