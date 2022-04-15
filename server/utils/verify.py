from datetime import date, datetime
from models import booking as booking_model


def allowed_email_suffixes() -> list:
    return ["com", "net", "org", "me"]


def allow_email_suffix(suffix) -> bool:
    return suffix in allowed_email_suffixes()


def allowed_email_domains() -> list:
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


def allow_email_domain(domain) -> bool:
    return domain in allowed_email_domains()


def verify_email_address(email) -> bool:
    domain = email.split("@")[1]
    return allow_email_domain(domain.split(".")[0].lower()) and allow_email_suffix(
        domain.split(".")[-1].lower()
    )


def convert_str_to_date(date_str) -> date:
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def allow_booking_date(date) -> bool:
    date = convert_str_to_date(date)
    return date >= date.today()


def allow_booking_price(time, price) -> bool:
    if time == "booking-morning":
        return int(price) == int("2000")
    elif time == "booking-afternonn":
        return int(price) == int("2500")
    else:
        return False


def verify_booking_info(booking_info) -> bool:
    return allow_booking_date(booking_info["date"]) and allow_booking_price(
        booking_info["type"], booking_info["price"]
    )


def verify_orders_price(booking_id, order_price) -> bool:
    total_price = 0
    for id in booking_id:
        total_price += int(booking_model.get_price_by_booking_id(booking_id=id))
    return int(total_price) == int(order_price)
