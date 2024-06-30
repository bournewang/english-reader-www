import React, { useEffect, useState } from 'react';
import { getSubscriptions, suspendSubscription, cancelSubscription, activateSubscription } from '~api/paypal';
import { useUser } from '~contexts/UserContext';
import { userInfo } from '~api/user';
import Loading from './Loading';
interface Subscription {
    subscription_id: string;
    plan_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const SubscriptionManagement: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    // const [data, setData] = useState({ premium: true, expires_at: '2024-07-029' })
    const { user, setUser } = useUser();

    useEffect(() => {
        fetchSubscriptions();
        userInfo().then(response => {
            console.log(response)
            if (response.data) {
                // setData(response.data)
                setUser(response.data)
            }
        })
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await getSubscriptions();
            setSubscriptions(response.subscriptions);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (subscriptionId: string) => {
        try {
            setLoading(true);
            suspendSubscription(subscriptionId).then(response => {
                setLoading(false);
                if (response.subscriptions) {
                    setSubscriptions(response.subscriptions)
                }
            })
            //   await fetchSubscriptions();
        } catch (error) {
            setLoading(false);
            console.error('Error suspending subscription:', error);
        }
    };

    const handleCancel = async (subscriptionId: string) => {
        try {
            setLoading(true)
            cancelSubscription(subscriptionId).then(response => {
                setLoading(false);
                if (response.subscriptions) {
                    setSubscriptions(response.subscriptions)
                }

            })
            //   fetchSubscriptions();
        } catch (error) {
            setLoading(false);
            console.error('Error cancelling subscription:', error);
        }
    };

    const handleActivate = async (subscriptionId: string) => {
        try {
            setLoading(true)
            activateSubscription(subscriptionId).then(response => {
                setLoading(false);
                if (response.subscriptions) {
                    setSubscriptions(response.subscriptions)
                }
            })
            //   fetchSubscriptions();
        } catch (error) {
            setLoading(false);
            console.error('Error activating subscription:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {loading && <Loading />}
            <div className="shadow-md rounded-lg p-6 mb-6 text-right">
                {/* <h2 className="text-3xl font-bold mb-4">Subscription Details</h2> */}
                <p className="text-lg mb-2">
                    <span className="">Your Plan: </span>
                    {/* {data.premium ? 'Active' : 'Inactive'} */}
                    <span className={`ml-2 px-2 py-1 rounded text-white ${user.premium ? 'bg-green-600' : 'bg-gray-600'}`}>
                        {user.premium ? 'Premium' : 'Free'}
                    </span>
                </p>
                {user.premium && <p className="text-lg">
                    <span className="">Expires At:</span> {user.expires_at ? new Date(user.expires_at).toLocaleDateString() : 'N/A'}
                </p>}
            </div>
            <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
            <table className="shadow-md  min-w-full bg-white border text-center">
                <thead>
                    <tr>
                        {/* <th className="py-2 border-b">Subscription ID</th> */}
                        {/* <th className="py-2 border-b">Plan ID</th> */}
                        <th className="py-2 border-b">Plan Name</th>
                        <th className="py-2 border-b">Status</th>
                        <th className="py-2 border-b">Created At</th>
                        <th className="py-2 border-b">Updated At</th>
                        <th className="py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map(subscription => (
                        <tr key={subscription.subscription_id}>
                            {/* <td className="py-2 border-b">{subscription.subscription_id}</td> */}
                            {/* <td className="py-2 border-b">{subscription.plan_id}</td> */}
                            <td className="py-2 border-b">{subscription.plan_name}</td>
                            <td className={`py-2 border-b ${subscription.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                                {subscription.status}
                            </td>
                            <td className="py-2 border-b">{new Date(subscription.created_at).toLocaleString()}</td>
                            <td className="py-2 border-b">{new Date(subscription.updated_at).toLocaleString()}</td>
                            <td className="py-2 border-b">
                                {subscription.status === 'ACTIVE' && (
                                    <>
                                        <button
                                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 mr-2"
                                            onClick={() => handleSuspend(subscription.subscription_id)}
                                        >
                                            Suspend
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                            onClick={() => handleCancel(subscription.subscription_id)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {subscription.status === 'SUSPENDED' && (
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                                        onClick={() => handleActivate(subscription.subscription_id)}
                                    >
                                        Activate
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubscriptionManagement
