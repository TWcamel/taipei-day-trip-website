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


def is_valid_email_address(email):
    domain = email.split("@")[1]
    return allow_email_domain(domain.split(".")[0].lower()) and allow_email_suffix(
        domain.split(".")[-1].lower()
    )
