import { useState } from 'react';
import {
  Card,
  Stack,
  Text,
  Badge,
  Heading,
  Divider,
  Button,
} from '@mond-design-system/theme';
import { ModernIcon } from '../components/ModernIcon';

// Mock ticket data
const festivals = [
  {
    id: "1",
    name: "Electric Dreams 2024",
    date: "July 15-17, 2024",
    location: "Neon Valley, CA",
    icon: "festival" as const,
    status: "available",
    ticketTypes: [
      { id: "general", name: "General Admission", price: 299, perks: ["3-day access", "Food court access", "Parking"] },
      { id: "vip", name: "VIP Experience", price: 599, perks: ["3-day access", "VIP viewing area", "Premium food", "Meet & greet", "Express entry"] },
      { id: "super-vip", name: "Super VIP", price: 1299, perks: ["3-day access", "Backstage access", "Artist dinner", "Hotel package", "Private shuttle"] }
    ]
  },
  {
    id: "2",
    name: "Neon Nights Festival",
    date: "August 22-24, 2024",
    location: "Electric City, NV",
    icon: "star" as const,
    status: "available",
    ticketTypes: [
      { id: "general", name: "Desert Access", price: 249, perks: ["3-day access", "Camping allowed", "Water stations"] },
      { id: "vip", name: "Electric VIP", price: 499, perks: ["3-day access", "Air-conditioned lounge", "Premium drinks", "Artist sessions"] }
    ]
  }
];

const addOns = [
  { id: "camping", name: "Festival Camping", price: 89, description: "3-night camping pass with facilities" },
  { id: "parking", name: "Premium Parking", price: 45, description: "Close parking with shuttle service" },
  { id: "merch", name: "Merchandise Package", price: 75, description: "Official festival t-shirt + poster" },
  { id: "food", name: "Meal Plan", price: 120, description: "All-you-can-eat for 3 days" }
];

export default function Tickets() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFestival, setSelectedFestival] = useState(festivals[0]);
  const [selectedTicketType, setSelectedTicketType] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '18+'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [wantInsurance, setWantInsurance] = useState(false);

  const steps = [
    { id: 'select', title: 'Select Tickets', description: 'Choose festival and ticket type' },
    { id: 'addons', title: 'Add-Ons', description: 'Enhance your experience' },
    { id: 'info', title: 'Your Info', description: 'Personal details' },
    { id: 'payment', title: 'Payment', description: 'Complete purchase' },
    { id: 'confirmation', title: 'Confirmation', description: 'Order complete' }
  ];

  const selectedTicket = selectedFestival.ticketTypes.find(t => t.id === selectedTicketType);
  const addOnTotal = selectedAddOns.reduce((total, addonId) => {
    const addon = addOns.find(a => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
  const subtotal = (selectedTicket?.price || 0) * quantity + addOnTotal;
  const fees = subtotal * 0.08;
  const insurance = wantInsurance ? 29 : 0;
  const total = subtotal + fees + insurance;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddOnToggle = (addonId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return selectedTicket && quantity > 0;
      case 1: return true;
      case 2: return guestInfo.firstName && guestInfo.lastName && guestInfo.email;
      case 3: return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && agreeTerms;
      default: return true;
    }
  };

  return (
    <div className="page-container">
      <Stack spacing="6">
        {/* Header */}
        <div className="hero-section">
          <Stack spacing="3" align="center">
            <Stack direction="horizontal" spacing="3" align="center">
              <ModernIcon type="diamond" size="xl" />
              <Heading size="4xl" weight="bold" semantic="primary">
                FESTIVAL TICKETS
              </Heading>
              <ModernIcon type="diamond" size="xl" />
            </Stack>
            <Text variant="body-lg" semantic="secondary">
              Secure your spot at the most electric festivals
            </Text>
            <Badge variant="primary" size="lg">
              <ModernIcon type="star" size="sm" />
              SECURE CHECKOUT
            </Badge>
          </Stack>
        </div>

        {/* Progress Stepper */}
        <Card variant="glass" padding="20">
          <div className="responsive-grid stepper">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-item ${index < currentStep ? 'completed' : index === currentStep ? 'active' : 'disabled'}`}
              >
                <div className="step-number">
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <Stack spacing="1" align="center">
                  <Text variant="caption" weight="bold" semantic="primary">
                    {step.title}
                  </Text>
                  <Text variant="caption" semantic="secondary">
                    {step.description}
                  </Text>
                </Stack>
              </div>
            ))}
          </div>
        </Card>

        {/* Main Layout */}
        <div className="responsive-grid ticket-layout">
          {/* Main Content */}
          <div className="ticket-main">
            <Card variant="elevated" padding="32">
              <Stack spacing="6">

                {/* Step 0: Festival Selection */}
                {currentStep === 0 && (
                  <Stack spacing="6">
                    <Stack spacing="3" align="center">
                      <ModernIcon type="festival" size="xl" />
                      <Heading size="2xl" semantic="primary">
                        Select Your Festival Experience
                      </Heading>
                      <Text variant="body-lg" semantic="secondary" align="center">
                        Choose from our premium festival collection
                      </Text>
                    </Stack>

                    {/* Festival Selection */}
                    <Stack spacing="4">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        Choose Festival
                      </Text>
                      <div className="responsive-grid festivals">
                        {festivals.map((festival) => (
                          <Card
                            key={festival.id}
                            variant={selectedFestival.id === festival.id ? "elevated" : "outlined"}
                            padding="20"
                          >
                            <Stack spacing="4">
                              <div className="responsive-grid festival-header">
                                <ModernIcon type={festival.icon} size="xl" />
                                <Button
                                  variant={selectedFestival.id === festival.id ? "primary" : "ghost"}
                                  size="sm"
                                  onClick={() => setSelectedFestival(festival)}
                                >
                                  {selectedFestival.id === festival.id ? "SELECTED" : "SELECT"}
                                </Button>
                              </div>
                              <Stack spacing="2">
                                <Heading size="md" semantic="primary">
                                  {festival.name}
                                </Heading>
                                <Text variant="caption" semantic="secondary">
                                  {festival.date}
                                </Text>
                                <Text variant="caption" semantic="secondary">
                                  {festival.location}
                                </Text>
                              </Stack>
                            </Stack>
                          </Card>
                        ))}
                      </div>
                    </Stack>

                    {/* Ticket Type Selection */}
                    <Stack spacing="4">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        Choose Ticket Type
                      </Text>
                      <Stack spacing="3">
                        {selectedFestival.ticketTypes.map((ticket) => (
                          <Card
                            key={ticket.id}
                            variant={selectedTicketType === ticket.id ? "elevated" : "outlined"}
                            padding="16"
                          >
                            <div className="responsive-grid ticket-option">
                              <Stack spacing="2">
                                <label className="ticket-radio">
                                  <input
                                    type="radio"
                                    name="ticketType"
                                    value={ticket.id}
                                    checked={selectedTicketType === ticket.id}
                                    onChange={(e) => setSelectedTicketType(e.target.value)}
                                  />
                                  <Text variant="body-md" weight="bold" semantic="primary">
                                    {ticket.name}
                                  </Text>
                                </label>
                                <Stack direction="horizontal" spacing="2" className="perks">
                                  {ticket.perks.map((perk) => (
                                    <Badge key={perk} variant="secondary" size="sm">
                                      {perk}
                                    </Badge>
                                  ))}
                                </Stack>
                              </Stack>
                              <Badge variant="primary" size="md">
                                ${ticket.price}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </Stack>
                    </Stack>

                    {/* Quantity Selection */}
                    <Stack spacing="4">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        Number of Tickets
                      </Text>
                      <div className="quantity-selector">
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          min={1}
                          max={8}
                          className="quantity-input"
                        />
                      </div>
                    </Stack>
                  </Stack>
                )}

                {/* Step 1: Add-Ons */}
                {currentStep === 1 && (
                  <Stack spacing="6">
                    <Heading size="lg" semantic="primary">
                      Enhance Your Experience
                    </Heading>
                    <Text variant="body-md" semantic="secondary">
                      Add optional extras to make your festival unforgettable
                    </Text>

                    <div className="responsive-grid addons">
                      {addOns.map((addon) => (
                        <Card key={addon.id} variant="outlined" padding="20">
                          <Stack spacing="4">
                            <div className="responsive-grid addon-header">
                              <Stack spacing="2">
                                <Text variant="body-md" weight="bold" semantic="primary">
                                  {addon.name}
                                </Text>
                                <Text variant="body-sm" semantic="secondary">
                                  {addon.description}
                                </Text>
                              </Stack>
                              <Badge variant="primary" size="sm">
                                +${addon.price}
                              </Badge>
                            </div>
                            <label className="addon-checkbox">
                              <input
                                type="checkbox"
                                checked={selectedAddOns.includes(addon.id)}
                                onChange={() => handleAddOnToggle(addon.id)}
                              />
                              <span>Add to order</span>
                            </label>
                          </Stack>
                        </Card>
                      ))}
                    </div>

                    <Card variant="glass" padding="16">
                      <Text variant="body-sm" semantic="primary">
                        💡 <strong>Pro Tip:</strong> Save money by bundling add-ons! Camping + Parking + Meal Plan = 15% discount
                      </Text>
                    </Card>
                  </Stack>
                )}

                {/* Step 2: Guest Information */}
                {currentStep === 2 && (
                  <Stack spacing="6">
                    <Heading size="lg" semantic="primary">
                      Your Information
                    </Heading>

                    <div className="responsive-grid info-sections">
                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Personal Details
                        </Text>
                        <input
                          type="text"
                          placeholder="First Name"
                          value={guestInfo.firstName}
                          onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={guestInfo.lastName}
                          onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                          className="form-input"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                          className="form-input"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                          className="form-input"
                        />
                      </Stack>

                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Age Verification
                        </Text>
                        <select
                          value={guestInfo.age}
                          onChange={(e) => setGuestInfo({...guestInfo, age: e.target.value})}
                          className="form-select"
                        >
                          <option value="18+">18+ Years</option>
                          <option value="21+">21+ Years</option>
                          <option value="under-18">Under 18 (Guardian Required)</option>
                        </select>

                        <Card variant="glass" padding="16">
                          <Text variant="body-sm" semantic="primary">
                            ⚠️ <strong>Important:</strong> Valid ID matching the name on this order will be required at festival entry.
                          </Text>
                        </Card>
                      </Stack>
                    </div>
                  </Stack>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <Stack spacing="6">
                    <Heading size="lg" semantic="primary">
                      Payment Information
                    </Heading>

                    <div className="responsive-grid payment-sections">
                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Payment Method
                        </Text>
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          className="form-input"
                        />
                        <div className="responsive-grid card-details">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            className="form-input"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            className="form-input"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                          className="form-input"
                        />
                      </Stack>

                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Insurance & Protection
                        </Text>
                        <Card variant="outlined" padding="16">
                          <Stack spacing="3">
                            <div className="responsive-grid insurance-option">
                              <Stack spacing="1">
                                <Text variant="body-sm" weight="bold" semantic="primary">
                                  Event Protection Insurance
                                </Text>
                                <Text variant="caption" semantic="secondary">
                                  Full refund if you can't attend due to covered reasons
                                </Text>
                              </Stack>
                              <label className="insurance-switch">
                                <input
                                  type="checkbox"
                                  checked={wantInsurance}
                                  onChange={(e) => setWantInsurance(e.target.checked)}
                                />
                                <span>Add insurance</span>
                              </label>
                            </div>
                            {wantInsurance && (
                              <Badge variant="primary" size="sm">
                                +$29 Insurance Fee
                              </Badge>
                            )}
                          </Stack>
                        </Card>

                        <Card variant="glass" padding="16">
                          <Text variant="body-sm" semantic="primary">
                            🔒 <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                          </Text>
                        </Card>
                      </Stack>
                    </div>

                    <Divider />

                    <label className="terms-checkbox">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                  </Stack>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <Stack spacing="6" align="center">
                    <ModernIcon type="star" size="2xl" />
                    <Heading size="2xl" semantic="primary">
                      ORDER CONFIRMED!
                    </Heading>
                    <Text variant="body-lg" semantic="secondary" align="center">
                      Your tickets have been purchased successfully. Check your email for confirmation and entry details.
                    </Text>

                    <Card variant="elevated" padding="20">
                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </Text>
                        <div className="responsive-grid order-detail">
                          <Text variant="caption" semantic="secondary">Festival</Text>
                          <Text variant="caption" semantic="primary">{selectedFestival.name}</Text>
                        </div>
                        <div className="responsive-grid order-detail">
                          <Text variant="caption" semantic="secondary">Tickets</Text>
                          <Text variant="caption" semantic="primary">{quantity}x {selectedTicket?.name}</Text>
                        </div>
                        <div className="responsive-grid order-detail">
                          <Text variant="caption" semantic="secondary">Total Paid</Text>
                          <Text variant="body-md" weight="bold" semantic="primary">${total.toFixed(2)}</Text>
                        </div>
                      </Stack>
                    </Card>

                    <Stack direction="horizontal" spacing="4">
                      <Button variant="primary" size="lg">
                        VIEW TICKETS
                      </Button>
                      <Button variant="outline" size="lg">
                        DOWNLOAD PDF
                      </Button>
                    </Stack>
                  </Stack>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="responsive-grid navigation">
                    <Button
                      variant="ghost"
                      disabled={currentStep === 0}
                      onClick={handleBack}
                    >
                      BACK
                    </Button>
                    <Button
                      variant="primary"
                      disabled={!isStepValid()}
                      onClick={handleNext}
                    >
                      {currentStep === 3 ? 'COMPLETE PURCHASE' : 'CONTINUE'}
                    </Button>
                  </div>
                )}
              </Stack>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="ticket-sidebar">
            <Stack spacing="6">
              <Card variant="elevated" padding="24">
                <Stack spacing="6">
                  <Stack direction="horizontal" spacing="3" align="center">
                    <ModernIcon type="diamond" size="md" />
                    <Heading size="lg" semantic="primary">
                      ORDER SUMMARY
                    </Heading>
                  </Stack>
                  <Divider />

                  <Stack spacing="2">
                    <div className="responsive-grid summary-item">
                      <Text variant="caption" semantic="secondary">Festival</Text>
                      <Text variant="caption" semantic="primary">{selectedFestival.name}</Text>
                    </div>

                    {selectedTicket && (
                      <div className="responsive-grid summary-item">
                        <Text variant="caption" semantic="secondary">{selectedTicket.name} x{quantity}</Text>
                        <Text variant="caption" semantic="primary">${(selectedTicket.price * quantity).toFixed(2)}</Text>
                      </div>
                    )}

                    {selectedAddOns.map((addonId) => {
                      const addon = addOns.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="responsive-grid summary-item">
                          <Text variant="caption" semantic="secondary">{addon.name}</Text>
                          <Text variant="caption" semantic="primary">${addon.price.toFixed(2)}</Text>
                        </div>
                      ) : null;
                    })}

                    <Divider />

                    <div className="responsive-grid summary-item">
                      <Text variant="caption" semantic="secondary">Subtotal</Text>
                      <Text variant="caption" semantic="primary">${subtotal.toFixed(2)}</Text>
                    </div>

                    <div className="responsive-grid summary-item">
                      <Text variant="caption" semantic="secondary">Service Fees</Text>
                      <Text variant="caption" semantic="primary">${fees.toFixed(2)}</Text>
                    </div>

                    {wantInsurance && (
                      <div className="responsive-grid summary-item">
                        <Text variant="caption" semantic="secondary">Insurance</Text>
                        <Text variant="caption" semantic="primary">${insurance.toFixed(2)}</Text>
                      </div>
                    )}

                    <Divider />

                    <div className="responsive-grid summary-item">
                      <Text variant="body-md" weight="bold" semantic="primary">Total</Text>
                      <Text variant="body-md" weight="bold" semantic="primary">${total.toFixed(2)}</Text>
                    </div>
                  </Stack>

                  <Text variant="caption" semantic="secondary">
                    Step {currentStep + 1} of {steps.length}
                  </Text>
                </Stack>
              </Card>

              {/* Trust Indicators */}
              <Stack spacing="2">
                <Badge variant="success" size="sm">
                  <ModernIcon type="diamond" size="sm" /> SSL SECURED
                </Badge>
                <Badge variant="primary" size="sm">
                  <ModernIcon type="crown" size="sm" /> TRUSTED PAYMENT
                </Badge>
                <Badge variant="secondary" size="sm">
                  <ModernIcon type="music" size="sm" /> MOBILE TICKETS
                </Badge>
              </Stack>
            </Stack>
          </div>
        </div>
      </Stack>
    </div>
  );
}