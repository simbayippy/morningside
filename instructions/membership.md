# Task: create membership schema/ functionality in the app

The main objective of this task is to create/add an Alumni Membership schema to our database, and add membership functionality to our app (such as signing up to be a memeber etc)

Currently, we already have 2 User related schemas, one from supabase which handles Auth (log-in / sign up etc), and one in our schema.primsa which contains more information of the user.

I now want to create a Member table which contains details of verfied Alumni members of the university. We can EITHER create a new member table or extend on the user one, take a look at which is better.

# Core requirements:

## Member details

some details from the existing membership from the Alumni's foundations excel sheet contains:

- Salutation English Name Preferred Name Chinese Name Gender Date of registration Membership-Type Membership-fee Date-of-transaction Employer Position Class Faculty Major CUSID Phone Number Email Address

## Member types

For the above, Membership-Type contains 3 types of membersships: Honorary, Ordinary I and Ordinary II. More on membership types:

Each membership class has the rights of the previous classes.

### Student Membership: Who is enrolled as a student of the College and has not graduated.

- Participate in any activities for the membership class organized by the Association; and
- Attend General Meetings and express opinions.

### Ordinary (Class II) Membership: Who has been a student of the College.

- Participate in the Election Committee.

### Ordinary (Class I) Membership: Who is a Graduate of the College.

- Elect and to be elected as an Executive Committee member of the Association;
- Nominate and be nominated as an Executive Committee member of the Association;
- Propose resolutions and vote in the General Meeting;
- Propose amendments to the Constitution; and
- Appoint a Proxy to attend a General Meeting.

### Membership Fee 會費

- Student Membership: Free
- Ordinary (Class II) Membership: Lifetime HKD 500
- Ordinary (Class I) Membership: Lifetime HKD 500

# New Added functionality

Now with this Member type, we need to be able to have another signup/ verification process to convert the User to a Member, as when they sign up for an account, we simply create a new Supabase user and User type in our schema.prisma

For a user to become a member, they have to fill up a form with the ## Member details from before

Basically, a user can create an account and not be a Member yet, but in order to be a member they have to fill up the form in order to verify that they are in fact an Alumni and hence a member.

- Therefore, we will need to then create some new functionality (a form perhaps) for Users to fill in if they want to become verified members
