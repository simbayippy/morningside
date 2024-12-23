## 1. Updating of Prisma user schema

There are a few changes which we need to make to the User schema:

1. We need another memberType enum in User, to see if a user is a memeber of this Alumni group

- the type of a member can be None, Student, Ordinary (Class I), Ordinary (Class II), Honorary. These refer to different heirachy in the Unviersity alumni.
- Basically all users who are NOT None member type, are part of this alumni group
- When a user first creates an account (User), he will be of type None.
- Users will need to verify his identity in a seperate portion of the website

2. Add Industry, Company, Phone and CUSID as fields to a User

## 2. Middleware for admin routes

- properly set up middleware for admin routes
- eitehr create admin middleware
- or within each page use @auth.ts under utils to see if user is admin, if not redriect out
