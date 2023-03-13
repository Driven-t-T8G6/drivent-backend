import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51Ml0EjLlHdvTrLnrsr6hNNPWVlW14TssF3gp7DKjo4VUcL6y5UednXw5gZlYEZv95GHIRyhILsvVcn8aAr9Ukkbb00luFePFxU', {
  apiVersion: '2022-11-15',
});

export default stripe;