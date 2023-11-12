import uuid as uuid_pkg


def generate_uuid() -> str:
    return str(uuid_pkg.uuid4())
