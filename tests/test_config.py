from src.config import validate_config


def test_config_validation():

    validate_config()

    assert True