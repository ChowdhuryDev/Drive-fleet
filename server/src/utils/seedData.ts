import { Car } from '../models/Car';

const initialCars = [
  {
    carName: 'Mercedes-Benz S 580 4MATIC',
    dailyRentPrice: 240,
    carType: 'Luxury',
    imageURL:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    pickupLocation: 'Downtown Financial Center, Bay Area',
    description:
      'Executive luxury sedan with Burmester 3D sound, heated executive massage seats, and active air suspension. Perfect for high-profile business meetings.',
    availabilityStatus: 'available',
    ownerEmail: 'alex.morgan@drivefleet.io',
    ownerName: 'Alex Morgan',
    ownerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bookingCount: 14,
  },
  {
    carName: 'Porsche 911 Carrera S (992)',
    dailyRentPrice: 320,
    carType: 'Coupe',
    imageURL:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 2,
    pickupLocation: 'Marina District Waterfront, San Francisco',
    description:
      'Iconic rear-engine rear-wheel drive sports coupe. Twin-turbo flat-six producing 443 hp, Sport Chrono package, and sport exhaust system.',
    availabilityStatus: 'available',
    ownerEmail: 'elena.rostova@drivefleet.io',
    ownerName: 'Elena Rostova',
    ownerPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bookingCount: 22,
  },
  {
    carName: 'Range Rover SV Autobiography',
    dailyRentPrice: 275,
    carType: 'SUV',
    imageURL:
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    pickupLocation: 'Silicon Valley Executive Airport Hub',
    description:
      'The pinnacle of luxury all-terrain capability. Long wheelbase with reclining club seats, deployable work tables, and whisper-quiet cabin acoustics.',
    availabilityStatus: 'available',
    ownerEmail: 'marcus.vance@drivefleet.io',
    ownerName: 'Marcus Vance',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bookingCount: 19,
  },
  {
    carName: 'Audi RS6 Avant Quattro',
    dailyRentPrice: 210,
    carType: 'Sedan',
    imageURL:
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    pickupLocation: 'South Park Tech Boulevard, SoMa',
    description:
      'Super-wagon performance pairing 591 twin-turbo horsepower with full luggage utility. Dynamic all-wheel steering and ceramic braking package.',
    availabilityStatus: 'available',
    ownerEmail: 'alex.morgan@drivefleet.io',
    ownerName: 'Alex Morgan',
    ownerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bookingCount: 9,
  },
  {
    carName: 'BMW M4 Competition G82',
    dailyRentPrice: 230,
    carType: 'Coupe',
    imageURL:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 4,
    pickupLocation: 'Presidio Heights Scenic Terminal',
    description:
      'Track-bred precision dynamics with 503 hp S58 engine, M carbon bucket seats, and M carbon exterior aerodynamic package.',
    availabilityStatus: 'available',
    ownerEmail: 'david.chen@drivefleet.io',
    ownerName: 'David Chen',
    ownerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bookingCount: 31,
  },
  {
    carName: 'Tesla Model X Plaid',
    dailyRentPrice: 195,
    carType: 'SUV',
    imageURL:
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 6,
    pickupLocation: 'Palo Alto Supercharger Plaza',
    description:
      'Tri-motor all-electric SUV boasting 1,020 hp, 0-60 in 2.5 seconds, falcon wing doors, and yoke steering with full entertainment console.',
    availabilityStatus: 'available',
    ownerEmail: 'elena.rostova@drivefleet.io',
    ownerName: 'Elena Rostova',
    ownerPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bookingCount: 16,
  },
  {
    carName: 'Mercedes-Benz Sprinter Executive Jet',
    dailyRentPrice: 380,
    carType: 'Van',
    imageURL:
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 8,
    pickupLocation: 'SFO International Airport VIP Terminal',
    description:
      'Private jet on wheels tailored for executive delegations. Features 8 Maybach leather captain chairs, dual 43-inch smart displays, and espresso bar.',
    availabilityStatus: 'available',
    ownerEmail: 'marcus.vance@drivefleet.io',
    ownerName: 'Marcus Vance',
    ownerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bookingCount: 7,
  },
  {
    carName: 'Volkswagen Golf R Mk8',
    dailyRentPrice: 110,
    carType: 'Hatchback',
    imageURL:
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
    seatCapacity: 5,
    pickupLocation: 'North Beach Cultural District',
    description:
      'Nimble hot hatchback equipped with 315 hp, 4MOTION with torque vectoring, and special Nürburgring drift mode for spirited coastal drives.',
    availabilityStatus: 'available',
    ownerEmail: 'david.chen@drivefleet.io',
    ownerName: 'David Chen',
    ownerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bookingCount: 27,
  },
];

export const seedInitialCarsIfEmpty = async (): Promise<void> => {
  try {
    const count = await Car.countDocuments();
    if (count === 0) {
      console.log('Seeding initial luxury vehicle fleet into MongoDB Atlas...');
      await Car.insertMany(initialCars);
      console.log(`✅ Successfully seeded ${initialCars.length} vehicles.`);
    }
  } catch (error) {
    console.warn('Vehicle seed check notice:', (error as Error).message);
  }
};
