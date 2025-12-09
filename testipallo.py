"""
Testipallo - A simple module for testing purposes
"""


def laske_summa(a, b):
    """
    Calculate the sum of two numbers.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The sum of a and b
    """
    return a + b


def laske_erotus(a, b):
    """
    Calculate the difference of two numbers.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The difference of a and b
    """
    return a - b


def laske_tulo(a, b):
    """
    Calculate the product of two numbers.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The product of a and b
    """
    return a * b


def tervehdi(nimi="Maailma"):
    """
    Return a greeting message.
    
    Args:
        nimi: Name to greet (default: "Maailma")
    
    Returns:
        A greeting string
    """
    return f"Terve, {nimi}!"
