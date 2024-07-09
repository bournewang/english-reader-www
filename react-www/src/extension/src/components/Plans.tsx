import React, { useEffect, useState } from 'react';
import { getPlans, createSubscription } from '~api/paypal';
import Loading from './Loading';
interface Plan {
  product_id: string;
  id: string;
  name: string;
  description: string;
  interval_unit: string;
  interval_count: number;
  value: string;
  currency: string;
}

const App: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const plans = await getPlans();
      setLoading(false);
      setPlans(plans);
      // TODO: Select the first plan by default
      setSelectedPlan(plans[0]);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching plans:', error);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleCreateSubscription = async () => {
    if (selectedPlan) {
      try {
        setLoading(true);
        const response = await createSubscription(selectedPlan.id);
        setLoading(false);
        if (response.approval_url)
          chrome.tabs.create({ url: response.approval_url }); // Redirect to PayPal approval URL
        confirm('Are you finished the payment?');
      } catch (error) {
        setLoading(false);
        console.error('Error creating subscription:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Plans</h1>
      <ul className="space-y-4">
        {plans.map(plan => (
          <li key={plan.id}>
            <label
              htmlFor={plan.id}
              className={`flex items-center p-4 border rounded shadow-sm cursor-pointer transition duration-150 ease-in-out ${selectedPlan.id === plan.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                }`}
              onClick={() => handleSelectPlan(plan)}
            >
              <input
                type="radio"
                id={plan.id}
                name="plan"
                value={plan.id}
                checked={selectedPlan.id === plan.id}
                onChange={() => handleSelectPlan(plan)}
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="text-gray-700">{plan.description}</p>
                {plan.value && <p className="text-gray-700">
                  {plan.interval_count} {plan.interval_unit}(s) for ${plan.value} {plan.currency}
                </p>}
              </div>
            </label>
          </li>
        ))}
      </ul>
      {selectedPlan && (
        <div className="mt-8 p-4 border rounded shadow-sm bg-green-100 border-green-500 text-center">
          {/* <h2 className="text-xl font-semibold">Selected Plan</h2> */}
          <h2 className="text-lg text-gray-700">{selectedPlan.name}
             { selectedPlan.value && <>, {selectedPlan.currency}{selectedPlan.value} </>}
             { selectedPlan.interval_count && <>, for every {selectedPlan.interval_count}{selectedPlan.interval_unit}</>}
          </h2>
          <button
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={handleCreateSubscription}
          >
            Subscribe Now
          </button>
        </div>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default App;
