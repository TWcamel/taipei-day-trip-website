from datetime import date, datetime


def allowed_email_suffixes():
    return ["com", "net", "org", "me"]


def allow_email_suffix(suffix):
    return suffix in allowed_email_suffixes()


def allowed_email_domains():
    return [
        "gmail",
        "hotmail",
        "yahoo",
        "outlook",
        "live",
        "msn",
        "aol",
        "pm",
        "yandex",
        "ply",
    ]


def allow_email_domain(domain):
    return domain in allowed_email_domains()


def verify_email_address(email):
    domain = email.split("@")[1]
    return allow_email_domain(domain.split(".")[0].lower()) and allow_email_suffix(
        domain.split(".")[-1].lower()
    )


def convert_str_to_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def allow_booking_date(date):
    date = convert_str_to_date(date)
    return date >= date.today()


def allow_booking_price(time, price):
    if time == "booking-morning":
        return int(price) == int("2000")
    elif time == "booking-afternonn":
        return int(price) == int("2500")
    else:
        return False


def verify_booking_info(booking_info):
    return allow_booking_date(booking_info["date"]) and allow_booking_price(
        booking_info["type"], booking_info["price"]
    )
