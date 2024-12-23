## Goal

The goal of this project is to create a University Alumni website for MCAA, that supports various features such as events browsing, events creation (admin side), Alumni directory for students part of this organisation to browse through.

A basic T3 (NextJS, Prisma, TRPC) project structure is provided in the codebase. Make sure to understand the project structure first before working on this project

We will be using ShadCN with tailwind css for styling and components

## Core Features/ Pages

### 1. Landing Page

- create a basic landing page that befits one of a University Alumni Portal

### 2. Upcoming Events

- Users should be able to see upcoming Events of MCAA,
- Users should be able enter each individual events to view more information

### 3. Event Registration

- Users should be able to register for the events they wish to join
- Users must be logged in inorder to be able to sign up for events. Currently we already have this account creation done

### 4. Event Creation

- Admins should be able to create new upcoming events
- Each event should include basic details of what the event are, such as 1. date, 2. description, 3. Price of event etc
- This page should be protected by an Admin middleware, to ensure only Admins can view and access this page

### 5. Alumni Directory

- Only logged in and VERIFIED Alumni/current students of MCAA can view this portal
- If they are not VERFIED, the page should be blockedd, asking the user to verify their status first.
