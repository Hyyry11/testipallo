"""
Tests for testipallo module
"""

import unittest
from testipallo import laske_summa, laske_erotus, laske_tulo, tervehdi


class TestLaskutoimitukset(unittest.TestCase):
    """Test mathematical operations"""
    
    def test_laske_summa(self):
        """Test sum calculation"""
        self.assertEqual(laske_summa(2, 3), 5)
        self.assertEqual(laske_summa(-1, 1), 0)
        self.assertEqual(laske_summa(0, 0), 0)
    
    def test_laske_erotus(self):
        """Test subtraction calculation"""
        self.assertEqual(laske_erotus(5, 3), 2)
        self.assertEqual(laske_erotus(0, 5), -5)
        self.assertEqual(laske_erotus(10, 10), 0)
    
    def test_laske_tulo(self):
        """Test multiplication calculation"""
        self.assertEqual(laske_tulo(2, 3), 6)
        self.assertEqual(laske_tulo(0, 5), 0)
        self.assertEqual(laske_tulo(-2, 3), -6)


class TestTervehdi(unittest.TestCase):
    """Test greeting function"""
    
    def test_tervehdi_default(self):
        """Test greeting with default name"""
        self.assertEqual(tervehdi(), "Terve, Maailma!")
    
    def test_tervehdi_custom_name(self):
        """Test greeting with custom name"""
        self.assertEqual(tervehdi("Pekka"), "Terve, Pekka!")
        self.assertEqual(tervehdi("Anna"), "Terve, Anna!")


if __name__ == '__main__':
    unittest.main()
