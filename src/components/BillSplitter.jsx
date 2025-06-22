import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, Calculator } from "lucide-react";

// US State tax rates
const stateTaxRates = {
  'AL': 0.04, 'AK': 0.00, 'AZ': 0.056, 'AR': 0.065, 'CA': 0.0725, 'CO': 0.029, 'CT': 0.0635,
  'DE': 0.00, 'FL': 0.06, 'GA': 0.04, 'HI': 0.04, 'ID': 0.06, 'IL': 0.0625, 'IN': 0.07,
  'IA': 0.06, 'KS': 0.065, 'KY': 0.06, 'LA': 0.0445, 'ME': 0.055, 'MD': 0.06, 'MA': 0.0625,
  'MI': 0.06, 'MN': 0.06875, 'MS': 0.07, 'MO': 0.04225, 'MT': 0.00, 'NE': 0.055, 'NV': 0.0685,
  'NH': 0.00, 'NJ': 0.06625, 'NM': 0.05125, 'NY': 0.08875, 'NC': 0.0475, 'ND': 0.05, 'OH': 0.0575,
  'OK': 0.045, 'OR': 0.00, 'PA': 0.06, 'RI': 0.07, 'SC': 0.06, 'SD': 0.045, 'TN': 0.07,
  'TX': 0.0625, 'UT': 0.061, 'VT': 0.06, 'VA': 0.053, 'WA': 0.065, 'WV': 0.06, 'WI': 0.05,
  'WY': 0.04
};

const stateNames = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

// Country configurations with currency and tax rates
const countryConfigs = {
  'US': {
    name: 'United States',
    currency: { symbol: '$', code: 'USD' },
    hasStateTax: true,
    defaultTaxRate: 0.08, // Average US sales tax
    regions: stateTaxRates,
    regionNames: stateNames
  },
  'CA': {
    name: 'Canada',
    currency: { symbol: 'C$', code: 'CAD' },
    hasStateTax: true,
    defaultTaxRate: 0.12, // Average HST/GST+PST
    regions: {
      'AB': 0.05, 'BC': 0.12, 'MB': 0.12, 'NB': 0.15, 'NL': 0.15,
      'NT': 0.05, 'NS': 0.15, 'NU': 0.05, 'ON': 0.13, 'PE': 0.15,
      'QC': 0.14975, 'SK': 0.11, 'YT': 0.05
    },
    regionNames: {
      'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick',
      'NL': 'Newfoundland and Labrador', 'NT': 'Northwest Territories', 'NS': 'Nova Scotia',
      'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec',
      'SK': 'Saskatchewan', 'YT': 'Yukon'
    }
  },
  'GB': {
    name: 'United Kingdom',
    currency: { symbol: '£', code: 'GBP' },
    hasStateTax: false,
    defaultTaxRate: 0.20, // VAT
    regions: {},
    regionNames: {}
  },
  'AU': {
    name: 'Australia',
    currency: { symbol: 'A$', code: 'AUD' },
    hasStateTax: false,
    defaultTaxRate: 0.10, // GST
    regions: {},
    regionNames: {}
  },
  'DE': {
    name: 'Germany',
    currency: { symbol: '€', code: 'EUR' },
    hasStateTax: false,
    defaultTaxRate: 0.19, // VAT
    regions: {},
    regionNames: {}
  },
  'FR': {
    name: 'France',
    currency: { symbol: '€', code: 'EUR' },
    hasStateTax: false,
    defaultTaxRate: 0.20, // VAT
    regions: {},
    regionNames: {}
  },
  'JP': {
    name: 'Japan',
    currency: { symbol: '¥', code: 'JPY' },
    hasStateTax: false,
    defaultTaxRate: 0.10, // Consumption tax
    regions: {},
    regionNames: {}
  },
  'IN': {
    name: 'India',
    currency: { symbol: '₹', code: 'INR' },
    hasStateTax: false,
    defaultTaxRate: 0.18, // GST
    regions: {},
    regionNames: {}
  },
  'BR': {
    name: 'Brazil',
    currency: { symbol: 'R$', code: 'BRL' },
    hasStateTax: false,
    defaultTaxRate: 0.17, // Average tax rate
    regions: {},
    regionNames: {}
  },
  'MX': {
    name: 'Mexico',
    currency: { symbol: 'MX$', code: 'MXN' },
    hasStateTax: false,
    defaultTaxRate: 0.16, // IVA
    regions: {},
    regionNames: {}
  }
};

const BillSplitter = () => {
  // Location and currency state
  const [userCountry, setUserCountry] = useState('US');
  const [userRegion, setUserRegion] = useState('');
  const [taxRate, setTaxRate] = useState(0.08);
  const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });
  const [locationDetected, setLocationDetected] = useState(false);

  // Friends management
  const [friends, setFriends] = useState([
    { id: 1, name: 'Me (Paid the bill)', isPayer: true },
    { id: 2, name: '', isPayer: false },
    { id: 3, name: '', isPayer: false }
  ]);

  // Expense items
  const [expenseItems, setExpenseItems] = useState([
    { id: 1, description: '', amount: '', participants: [1, 2, 3], isShared: true }
  ]);

  // Additional charges
  const [serviceFee, setServiceFee] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');

  // Results
  const [calculations, setCalculations] = useState({});

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const countryCode = data.countryCode;
          
          if (countryCode in countryConfigs) {
            const config = countryConfigs[countryCode];
            setUserCountry(countryCode);
            setCurrency(config.currency);
            
            if (config.hasStateTax && data.principalSubdivisionCode) {
              const region = data.principalSubdivisionCode.split('-')[1];
              if (region in config.regions) {
                setUserRegion(region);
                setTaxRate(config.regions[region]);
              } else {
                setTaxRate(config.defaultTaxRate);
              }
            } else {
              setTaxRate(config.defaultTaxRate);
            }
          } else {
            // Default to US if country not supported
            setUserCountry('US');
            setCurrency(countryConfigs['US'].currency);
            setTaxRate(countryConfigs['US'].defaultTaxRate);
          }
          setLocationDetected(true);
        } catch (error) {
          console.error("Error fetching location data:", error);
          // Default to US on error
          setUserCountry('US');
          setCurrency(countryConfigs['US'].currency);
          setTaxRate(countryConfigs['US'].defaultTaxRate);
        }
      }, (error) => {
        console.error("Error getting geolocation:", error);
        // Default to US on geolocation error
        setUserCountry('US');
        setCurrency(countryConfigs['US'].currency);
        setTaxRate(countryConfigs['US'].defaultTaxRate);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Default to US if geolocation not supported
      setUserCountry('US');
      setCurrency(countryConfigs['US'].currency);
      setTaxRate(countryConfigs['US'].defaultTaxRate);
    }
  }, []);

  const handleCountryChange = (country) => {
    const config = countryConfigs[country];
    setUserCountry(country);
    setCurrency(config.currency);
    setUserRegion('');
    setTaxRate(config.defaultTaxRate);
  };

  const handleRegionChange = (region) => {
    const config = countryConfigs[userCountry];
    setUserRegion(region);
    setTaxRate(config.regions[region]);
  };

  const addFriend = () => {
    const newId = Math.max(...friends.map(f => f.id)) + 1;
    setFriends([...friends, { id: newId, name: '', isPayer: false }]);
    // Add new friend to all shared expense items
    setExpenseItems(items => items.map(item => ({
      ...item,
      participants: item.isShared ? [...item.participants, newId] : item.participants
    })));
  };

  const removeFriend = (id) => {
    if (friends.length <= 2) return; // Keep at least 2 people
    setFriends(friends.filter(f => f.id !== id));
    // Remove friend from all expense items
    setExpenseItems(items => items.map(item => ({
      ...item,
      participants: item.participants.filter(p => p !== id)
    })));
  };

  const updateFriend = (id, name) => {
    setFriends(friends.map(f => f.id === id ? { ...f, name } : f));
  };

  const addExpenseItem = () => {
    const newId = Math.max(...expenseItems.map(e => e.id)) + 1;
    setExpenseItems([...expenseItems, {
      id: newId,
      description: '',
      amount: '',
      participants: friends.map(f => f.id),
      isShared: true
    }]);
  };

  const removeExpenseItem = (id) => {
    if (expenseItems.length <= 1) return; // Keep at least 1 item
    setExpenseItems(expenseItems.filter(e => e.id !== id));
  };

  const updateExpenseItem = (id, field, value) => {
    setExpenseItems(items => items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleParticipant = (itemId, friendId) => {
    setExpenseItems(items => items.map(item => {
      if (item.id === itemId) {
        const participants = item.participants.includes(friendId)
          ? item.participants.filter(p => p !== friendId)
          : [...item.participants, friendId];
        return { ...item, participants };
      }
      return item;
    }));
  };

  const calculateSplit = useCallback(() => {
    const tip = tipPercentage === 'custom' ? parseFloat(customTip) || 0 : tipPercentage;
    const serviceCharge = parseFloat(serviceFee) || 0;
    const deliveryCharge = parseFloat(deliveryFee) || 0;

    // Calculate each person's share
    const personTotals = {};
    friends.forEach(friend => {
      personTotals[friend.id] = 0;
    });

    // Calculate individual item costs
    expenseItems.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      if (amount > 0 && item.participants.length > 0) {
        const perPerson = amount / item.participants.length;
        item.participants.forEach(participantId => {
          personTotals[participantId] += perPerson;
        });
      }
    });

    // Calculate totals
    const subtotal = Object.values(personTotals).reduce((sum, amount) => sum + amount, 0);
    const taxAmount = subtotal * taxRate;
    const tipAmount = (subtotal * tip) / 100;
    
    // Distribute service fee and delivery fee equally among all friends
    const additionalFeesPerPerson = (serviceCharge + deliveryCharge) / friends.length;

    // Final calculations per person
    const finalCalculations = {};
    friends.forEach(friend => {
      const itemsCost = personTotals[friend.id];
      const taxShare = (itemsCost / subtotal) * taxAmount;
      const tipShare = (itemsCost / subtotal) * tipAmount;
      const total = itemsCost + taxShare + tipShare + additionalFeesPerPerson;
      
      finalCalculations[friend.id] = {
        itemsCost: itemsCost.toFixed(2),
        taxShare: taxShare.toFixed(2),
        tipShare: tipShare.toFixed(2),
        additionalFees: additionalFeesPerPerson.toFixed(2),
        total: total.toFixed(2)
      };
    });

    // Summary
    finalCalculations.summary = {
      subtotal: subtotal.toFixed(2),
      tax: taxAmount.toFixed(2),
      tip: tipAmount.toFixed(2),
      serviceFee: serviceCharge.toFixed(2),
      deliveryFee: deliveryCharge.toFixed(2),
      grandTotal: (subtotal + taxAmount + tipAmount + serviceCharge + deliveryCharge).toFixed(2)
    };

    setCalculations(finalCalculations);
  }, [expenseItems, friends, taxRate, tipPercentage, customTip, serviceFee, deliveryFee]);

  useEffect(() => {
    calculateSplit();
  }, [calculateSplit]);

  const currentConfig = countryConfigs[userCountry];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 p-4 sm:space-y-6 sm:p-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            Group Bill Splitter
          </CardTitle>
          {locationDetected && (
            <p className="text-xs sm:text-sm text-center text-gray-600">
              📍 Detected: {currentConfig.name} ({currency.code})
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Location Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <Select value={userCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(countryConfigs).map(([code, config]) => (
                    <SelectItem key={code} value={code}>
                      {config.name} ({config.currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentConfig.hasStateTax && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {userCountry === 'US' ? 'State' : 'Province/Territory'}
                </label>
                <Select value={userRegion} onValueChange={handleRegionChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select a ${userCountry === 'US' ? 'state' : 'province/territory'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currentConfig.regionNames).sort((a, b) => a[1].localeCompare(b[1])).map(([code, name]) => (
                      <SelectItem key={code} value={code}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Friends Management */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Group Members</h3>
              <Button onClick={addFriend} variant="outline" size="sm" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Person
              </Button>
            </div>
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <div key={friend.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Input
                    placeholder={friend.isPayer ? "Your name (You paid)" : `Person ${index + 1} name`}
                    value={friend.name}
                    onChange={(e) => updateFriend(friend.id, e.target.value)}
                    className={`flex-1 ${friend.isPayer ? "font-semibold bg-green-50" : ""}`}
                  />
                  <div className="flex items-center gap-2 justify-between sm:justify-start">
                    {friend.isPayer && <Badge variant="secondary" className="text-xs">Payer</Badge>}
                    {!friend.isPayer && friends.length > 2 && (
                      <Button onClick={() => removeFriend(friend.id)} variant="outline" size="sm" className="shrink-0">
                        <Trash2 className="w-4 h-4" />
                        <span className="ml-1 sm:hidden">Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Expense Items */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Expense Items</h3>
              <Button onClick={addExpenseItem} variant="outline" size="sm" className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {expenseItems.map((item) => (
                <Card key={item.id} className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <Input
                      placeholder="Item description (e.g., Hotel room, Dinner, Uber)"
                      value={item.description}
                      onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder={`Amount (${currency.symbol})`}
                      value={item.amount}
                      onChange={(e) => updateExpenseItem(item.id, 'amount', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who is sharing this expense?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`item-${item.id}-friend-${friend.id}`}
                            checked={item.participants.includes(friend.id)}
                            onCheckedChange={() => toggleParticipant(item.id, friend.id)}
                          />
                          <label htmlFor={`item-${item.id}-friend-${friend.id}`} className="text-sm truncate">
                            {friend.name || `Person ${friend.id}`}
                            {friend.isPayer && ' (You)'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {expenseItems.length > 1 && (
                    <Button onClick={() => removeExpenseItem(item.id)} variant="outline" size="sm" className="w-full sm:w-auto">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Item
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Charges */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Additional Charges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee</label>
                <Input
                  type="number"
                  placeholder={`${currency.symbol}0.00`}
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery/Other Fee</label>
                <Input
                  type="number"
                  placeholder={`${currency.symbol}0.00`}
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tip */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tip Percentage</label>
            <ToggleGroup 
              type="single" 
              value={tipPercentage} 
              onValueChange={(value) => setTipPercentage(value || tipPercentage)}
              className="grid grid-cols-2 sm:flex sm:justify-start gap-1 sm:gap-2"
            >
              {[15, 18, 20, 25].map((tip) => (
                <ToggleGroupItem key={tip} value={tip} aria-label={`${tip}% tip`} className="text-sm">
                  {tip}%
                </ToggleGroupItem>
              ))}
              <ToggleGroupItem value="custom" aria-label="Custom tip" className="text-sm col-span-2 sm:col-span-1">
                Custom
              </ToggleGroupItem>
            </ToggleGroup>
            {tipPercentage === 'custom' && (
              <Input
                type="number"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="Enter custom tip %"
                className="mt-3 text-sm"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {calculations.summary && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
              Split Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Bill Summary */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Bill Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                <div className="flex justify-between sm:block">
                  <span>Subtotal:</span>
                  <span className="font-medium">{currency.symbol}{calculations.summary.subtotal}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
                  <span className="font-medium">{currency.symbol}{calculations.summary.tax}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span>Tip ({tipPercentage === 'custom' ? customTip : tipPercentage}%):</span>
                  <span className="font-medium">{currency.symbol}{calculations.summary.tip}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span>Service Fee:</span>
                  <span className="font-medium">{currency.symbol}{calculations.summary.serviceFee}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span>Delivery Fee:</span>
                  <span className="font-medium">{currency.symbol}{calculations.summary.deliveryFee}</span>
                </div>
                <div className="flex justify-between sm:block font-semibold border-t pt-1 sm:border-t-0 sm:pt-0">
                  <span>Total:</span>
                  <span>{currency.symbol}{calculations.summary.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Individual Breakdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {friends.map((friend) => {
                const calc = calculations[friend.id];
                if (!calc) return null;
                
                return (
                  <Card key={friend.id} className={`${friend.isPayer ? "border-green-500 bg-green-50" : ""}`}>
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-semibold mb-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="truncate text-sm sm:text-base">
                          {friend.name || `Person ${friend.id}`}
                        </span>
                        {friend.isPayer && <Badge variant="secondary" className="text-xs w-fit">You</Badge>}
                      </h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span className="font-medium">{currency.symbol}{calc.itemsCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span className="font-medium">{currency.symbol}{calc.taxShare}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tip:</span>
                          <span className="font-medium">{currency.symbol}{calc.tipShare}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fees:</span>
                          <span className="font-medium">{currency.symbol}{calc.additionalFees}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold text-base sm:text-lg">
                          <span>Total:</span>
                          <span>{currency.symbol}{calc.total}</span>
                        </div>
                        {friend.isPayer && (
                          <div className="text-green-700 font-medium text-center mt-2 text-xs sm:text-sm">
                            You paid {currency.symbol}{calculations.summary.grandTotal}
                          </div>
                        )}
                        {!friend.isPayer && (
                          <div className="text-blue-700 font-medium text-center mt-2 text-xs sm:text-sm">
                            Owes you: {currency.symbol}{calc.total}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Payer Summary */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-100 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">💰 Your Summary (As the Person Who Paid)</h4>
              <div className="text-xs sm:text-sm text-green-700 space-y-1">
                <p>• You paid the total bill: {currency.symbol}{calculations.summary.grandTotal}</p>
                <p>• Your actual share: {currency.symbol}{calculations[friends.find(f => f.isPayer)?.id]?.total}</p>
                <p>• You should collect: {currency.symbol}{(parseFloat(calculations.summary.grandTotal) - parseFloat(calculations[friends.find(f => f.isPayer)?.id]?.total || 0)).toFixed(2)} from others</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillSplitter;
