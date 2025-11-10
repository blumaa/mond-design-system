import { useState } from 'react';
import {
  Box,
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
      <Box gap="md">
        {/* Header */}
        <div className="hero-section">
          <Box gap="md" alignItems="center">
            <Box display="flex" gap="md" alignItems="center">
              <ModernIcon type="diamond" size="xl" />
              <Heading size="4xl" weight="bold" semantic="primary">
                FESTIVAL TICKETS
              </Heading>
              <ModernIcon type="diamond" size="xl" />
            </Box>
            <Text semantic="secondary">
              Secure your spot at the most electric festivals
            </Text>
            <Badge size="lg">
              <ModernIcon type="star" size="sm" />
              SECURE CHECKOUT
            </Badge>
          </Box>
        </div>

        {/* Progress Stepper */}
        <Box>
          <div className="responsive-grid stepper">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-item ${index < currentStep ? 'completed' : index === currentStep ? 'active' : 'disabled'}`}
              >
                <div className="step-number">
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <Box gap="md" alignItems="center">
                  <Text weight="bold" semantic="primary">
                    {step.title}
                  </Text>
                  <Text semantic="secondary">
                    {step.description}
                  </Text>
                </Box>
              </div>
            ))}
          </div>
        </Box>

        {/* Main Layout */}
        <div className="responsive-grid ticket-layout">
          {/* Main Content */}
          <div className="ticket-main">
            <Box>
              <Box gap="md">

                {/* Step 0: Festival Selection */}
                {currentStep === 0 && (
                  <Box gap="md">
                    <Box gap="md" alignItems="center">
                      <ModernIcon type="festival" size="xl" />
                      <Heading size="2xl" semantic="primary">
                        Select Your Festival Experience
                      </Heading>
                      <Text semantic="secondary" alignItems="center">
                        Choose from our premium festival collection
                      </Text>
                    </Box>

                    {/* Festival Selection */}
                    <Box gap="md">
                      <Text weight="bold" semantic="primary">
                        Choose Festival
                      </Text>
                      <div className="responsive-grid festivals">
                        {festivals.map((festival) => (
                          <Box
                            key={festival.id}
                            bg={selectedFestival.id === festival.id ? "surface.elevated" : undefined}
                            p="xl"
                            borderRadius={8}
                          >
                            <Box gap="md">
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
                              <Box gap="md">
                                <Heading size="md" semantic="primary">
                                  {festival.name}
                                </Heading>
                                <Text semantic="secondary">
                                  {festival.date}
                                </Text>
                                <Text semantic="secondary">
                                  {festival.location}
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </div>
                    </Box>

                    {/* Ticket Type Selection */}
                    <Box gap="md">
                      <Text weight="bold" semantic="primary">
                        Choose Ticket Type
                      </Text>
                      <Box gap="md">
                        {selectedFestival.ticketTypes.map((ticket) => (
                          <Box
                            key={ticket.id}
                            bg={selectedTicketType === ticket.id ? "surface.elevated" : undefined}
                            p="lg"
                            borderRadius={8}
                          >
                            <div className="responsive-grid ticket-option">
                              <Box gap="md">
                                <label className="ticket-radio">
                                  <input
                                    type="radio"
                                    name="ticketType"
                                    value={ticket.id}
                                    checked={selectedTicketType === ticket.id}
                                    onChange={(e) => setSelectedTicketType(e.target.value)}
                                  />
                                  <Text weight="bold" semantic="primary">
                                    {ticket.name}
                                  </Text>
                                </label>
                                <Box display="flex" gap="md" className="perks">
                                  {ticket.perks.map((perk) => (
                                    <Badge key={perk} size="sm">
                                      {perk}
                                    </Badge>
                                  ))}
                                </Box>
                              </Box>
                              <Badge size="md">
                                ${ticket.price}
                              </Badge>
                            </div>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Quantity Selection */}
                    <Box gap="md">
                      <Text weight="bold" semantic="primary">
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
                    </Box>
                  </Box>
                )}

                {/* Step 1: Add-Ons */}
                {currentStep === 1 && (
                  <Box gap="md">
                    <Heading size="lg" semantic="primary">
                      Enhance Your Experience
                    </Heading>
                    <Text semantic="secondary">
                      Add optional extras to make your festival unforgettable
                    </Text>

                    <div className="responsive-grid addons">
                      {addOns.map((addon) => (
                        <Box key={addon.id}>
                          <Box gap="md">
                            <div className="responsive-grid addon-header">
                              <Box gap="md">
                                <Text weight="bold" semantic="primary">
                                  {addon.name}
                                </Text>
                                <Text semantic="secondary">
                                  {addon.description}
                                </Text>
                              </Box>
                              <Badge size="sm">
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
                          </Box>
                        </Box>
                      ))}
                    </div>

                    <Box>
                      <Text semantic="primary">
                        💡 <strong>Pro Tip:</strong> Save money by bundling add-ons! Camping + Parking + Meal Plan = 15% discount
                      </Text>
                    </Box>
                  </Box>
                )}

                {/* Step 2: Guest Information */}
                {currentStep === 2 && (
                  <Box gap="md">
                    <Heading size="lg" semantic="primary">
                      Your Information
                    </Heading>

                    <div className="responsive-grid info-sections">
                      <Box gap="md">
                        <Text weight="bold" semantic="primary">
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
                      </Box>

                      <Box gap="md">
                        <Text weight="bold" semantic="primary">
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

                        <Box>
                          <Text semantic="primary">
                            ⚠️ <strong>Important:</strong> Valid ID matching the name on this order will be required at festival entry.
                          </Text>
                        </Box>
                      </Box>
                    </div>
                  </Box>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <Box gap="md">
                    <Heading size="lg" semantic="primary">
                      Payment Information
                    </Heading>

                    <div className="responsive-grid payment-sections">
                      <Box gap="md">
                        <Text weight="bold" semantic="primary">
                          Payment Method
                        </Text>
                        <input
                          type="text"
                          placeholder="Box Number"
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
                          placeholder="Boxholder Name"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                          className="form-input"
                        />
                      </Box>

                      <Box gap="md">
                        <Text weight="bold" semantic="primary">
                          Insurance & Protection
                        </Text>
                        <Box>
                          <Box gap="md">
                            <div className="responsive-grid insurance-option">
                              <Box gap="md">
                                <Text weight="bold" semantic="primary">
                                  Event Protection Insurance
                                </Text>
                                <Text semantic="secondary">
                                  Full refund if you can't attend due to covered reasons
                                </Text>
                              </Box>
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
                              <Badge size="sm">
                                +$29 Insurance Fee
                              </Badge>
                            )}
                          </Box>
                        </Box>

                        <Box>
                          <Text semantic="primary">
                            🔒 <strong>Secure Payment:</strong> Your payment information is encrypted and secure.
                          </Text>
                        </Box>
                      </Box>
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
                  </Box>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <Box gap="md" alignItems="center">
                    <ModernIcon type="star" size="2xl" />
                    <Heading size="2xl" semantic="primary">
                      ORDER CONFIRMED!
                    </Heading>
                    <Text semantic="secondary" alignItems="center">
                      Your tickets have been purchased successfully. Check your email for confirmation and entry details.
                    </Text>

                    <Box>
                      <Box gap="md">
                        <Text weight="bold" semantic="primary">
                          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </Text>
                        <div className="responsive-grid order-detail">
                          <Text semantic="secondary">Festival</Text>
                          <Text semantic="primary">{selectedFestival.name}</Text>
                        </div>
                        <div className="responsive-grid order-detail">
                          <Text semantic="secondary">Tickets</Text>
                          <Text semantic="primary">{quantity}x {selectedTicket?.name}</Text>
                        </div>
                        <div className="responsive-grid order-detail">
                          <Text semantic="secondary">Total Paid</Text>
                          <Text weight="bold" semantic="primary">${total.toFixed(2)}</Text>
                        </div>
                      </Box>
                    </Box>

                    <Box display="flex" gap="md">
                      <Button size="lg">
                        VIEW TICKETS
                      </Button>
                      <Button size="lg">
                        DOWNLOAD PDF
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="responsive-grid navigation">
                    <Button
                     
                      disabled={currentStep === 0}
                      onClick={handleBack}
                    >
                      BACK
                    </Button>
                    <Button
                     
                      disabled={!isStepValid()}
                      onClick={handleNext}
                    >
                      {currentStep === 3 ? 'COMPLETE PURCHASE' : 'CONTINUE'}
                    </Button>
                  </div>
                )}
              </Box>
            </Box>
          </div>

          {/* Order Summary Sidebar */}
          <div className="ticket-sidebar">
            <Box gap="md">
              <Box>
                <Box gap="md">
                  <Box display="flex" gap="md" alignItems="center">
                    <ModernIcon type="diamond" size="md" />
                    <Heading size="lg" semantic="primary">
                      ORDER SUMMARY
                    </Heading>
                  </Box>
                  <Divider />

                  <Box gap="md">
                    <div className="responsive-grid summary-item">
                      <Text semantic="secondary">Festival</Text>
                      <Text semantic="primary">{selectedFestival.name}</Text>
                    </div>

                    {selectedTicket && (
                      <div className="responsive-grid summary-item">
                        <Text semantic="secondary">{selectedTicket.name} x{quantity}</Text>
                        <Text semantic="primary">${(selectedTicket.price * quantity).toFixed(2)}</Text>
                      </div>
                    )}

                    {selectedAddOns.map((addonId) => {
                      const addon = addOns.find(a => a.id === addonId);
                      return addon ? (
                        <div key={addonId} className="responsive-grid summary-item">
                          <Text semantic="secondary">{addon.name}</Text>
                          <Text semantic="primary">${addon.price.toFixed(2)}</Text>
                        </div>
                      ) : null;
                    })}

                    <Divider />

                    <div className="responsive-grid summary-item">
                      <Text semantic="secondary">Subtotal</Text>
                      <Text semantic="primary">${subtotal.toFixed(2)}</Text>
                    </div>

                    <div className="responsive-grid summary-item">
                      <Text semantic="secondary">Service Fees</Text>
                      <Text semantic="primary">${fees.toFixed(2)}</Text>
                    </div>

                    {wantInsurance && (
                      <div className="responsive-grid summary-item">
                        <Text semantic="secondary">Insurance</Text>
                        <Text semantic="primary">${insurance.toFixed(2)}</Text>
                      </div>
                    )}

                    <Divider />

                    <div className="responsive-grid summary-item">
                      <Text weight="bold" semantic="primary">Total</Text>
                      <Text weight="bold" semantic="primary">${total.toFixed(2)}</Text>
                    </div>
                  </Box>

                  <Text semantic="secondary">
                    Step {currentStep + 1} of {steps.length}
                  </Text>
                </Box>
              </Box>

              {/* Trust Indicators */}
              <Box gap="md">
                <Badge size="sm">
                  <ModernIcon type="diamond" size="sm" /> SSL SECURED
                </Badge>
                <Badge size="sm">
                  <ModernIcon type="crown" size="sm" /> TRUSTED PAYMENT
                </Badge>
                <Badge size="sm">
                  <ModernIcon type="music" size="sm" /> MOBILE TICKETS
                </Badge>
              </Box>
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
}