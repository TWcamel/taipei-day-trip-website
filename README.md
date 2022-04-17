- [TODO](#todo)
  - [Functionalities](#functionalities)
  - [User](#user)
  - [Orders](#orders)
  - [Booking](#booking)
  - [Follow-up implementation](#follow-up-implementation)
- [Reference](#reference)
  - [ER Model](#er-model)
  - [Useful links](#useful-links)

# TODO

## Functionalities

-   [ ] Image distribute to CDN (EC2 with RDS)
-   [x] docker to taipei time zone

## User

-   [x] user's order history

## Orders

-   [x] verify client's orders

## Booking

-   [x] shopping cart
-   [x] booking history
-   [x] check number of goods in the store house before place an order -> no store house needed

## Follow-up implementation

-   [ ] re-design user login for better security (JWT+cookie)
-   [ ] recommendation algo for trending attractions
-   [ ] cache for better UX
-   [ ] Unit test
-   [ ] CI\CD workflow using git action

# Reference

## ER Model

![picture 1](images/e5543779fffa284fd4ed14fb0ed222f9084cc17c50e5b7c7a6532463de7c95da.png)

## Useful links

-   [regexp](http://gskinner.com/RegExr/?2tr2n)
-   [mysql set to utf8 with dockerfile](https://stackoverflow.com/questions/45729326/how-to-change-the-default-character-set-of-mysql-using-docker-compose)
