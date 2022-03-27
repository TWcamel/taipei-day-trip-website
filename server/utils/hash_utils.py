import bcrypt

def hash_data(data):
    return bcrypt.hashpw(str_to_utf8(data), bcrypt.gensalt())


def check_data(data, hash):
    return bcrypt.checkpw(str_to_utf8(data), str_to_utf8(hash))

def str_to_utf8(data):
    return data.encode('utf-8')
