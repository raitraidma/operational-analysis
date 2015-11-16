function Fraction(numerator, denominator) {
	if (!numerator) {
		throw 'Missing numerator';
	}
	denominator = (!denominator) ? 1 : denominator;
	denominator = (typeof(denominator) === 'string') ? parseInt(denominator) : denominator;
	numerator = (typeof(numerator) === 'string') ? parseInt(numerator) : numerator;
    this.numerator = numerator;
    this.denominator = denominator;
    this.normalize();
}

Fraction.prototype.toString = function() {
	if (this.denominator === 1) {
		return this.numerator + '';
	}
	return this.numerator + '/' + this.denominator;
}

Fraction.prototype.clone = function() {
    return new Fraction(this.numerator, this.denominator);
}

Fraction.prototype.gcd = function(a, b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {
    	var temp = a; a = b; b = temp;
    }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

Fraction.prototype.normalize = function(a, b) {
    var gcd = this.gcd(this.numerator, this.denominator);
    this.numerator /= gcd;
    this.denominator /= gcd;
    if (this.denominator < 0) {
        this.numerator *= -1;
        this.denominator *= -1;
    }
    return this;
}

Fraction.prototype.rescale = function(factor) {
    this.numerator *= factor;
    this.denominator *= factor;
    return this;
}

Fraction.prototype.add = function(addend) {
    var augendFraction = this.clone();
    var addendFraction = addend.clone();

    var augendFractionDenominator = augendFraction.denominator;
    augendFraction.rescale(addendFraction.denominator);
    augendFraction.numerator += addendFraction.numerator * augendFractionDenominator;

    return augendFraction.normalize();
}

Fraction.prototype.subtract = function(subtrahend) {
    var subtrahendFraction = subtrahend.clone();
    subtrahendFraction.numerator *= -1;
    return this.add(subtrahendFraction);
}

Fraction.prototype.multiply = function(multiplier) {
    var multiplicand = this.clone();
    multiplicand.numerator *= multiplier.numerator;
    multiplicand.denominator *= multiplier.denominator;
    return multiplicand.normalize();
}

Fraction.prototype.divide = function(divisor) {
    var dividend = this.clone();
    dividend.numerator *= divisor.denominator;
    dividend.denominator *= divisor.numerator;
    return dividend.normalize();
}