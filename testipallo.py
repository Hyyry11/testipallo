"""
Testipallo - A simple module for testing purposes
"""


def laske_summa(a, b):
    """
    Calculate the sum of two numbers.
    
    Args:
        a (int or float): First number
        b (int or float): Second number
    
    Returns:
        int or float: The sum of a and b
    """
    return a + b


def laske_erotus(a, b):
    """
    Calculate the difference of two numbers.
    
    Args:
        a (int or float): First number
        b (int or float): Second number
    
    Returns:
        int or float: The difference of a and b
    """
    return a - b


def laske_tulo(a, b):
    """
    Calculate the product of two numbers.
    
    Args:
        a (int or float): First number
        b (int or float): Second number
    
    Returns:
        int or float: The product of a and b
    """
    return a * b


def tervehdi(nimi="Maailma"):
    """
    Return a greeting message.
    
    Args:
        nimi (str): Name to greet (default: "Maailma")
    
    Returns:
        str: A greeting string
    """
    return f"Terve, {nimi}!"
