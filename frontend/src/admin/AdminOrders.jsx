import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/authContextValue';
import '../styles/admin.css';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const data = await res.json();

        console.log('Orders API response:', data);

        if (res.ok) {
          // Backend returns { message, Orders: [...] }
          setOrders(Array.isArray(data.Orders) ? data.Orders : []);
        } else {
          console.error('Failed to fetch orders:', data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === id
              ? { ...order, status }
              : order
          )
        );
      } else {
        console.error('Failed to update status:', data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <div
        className="admin-data-page"
        style={containerStyle}
      >
        <h2 style={{ color: '#f97316' }}>Manage Orders</h2>

        <p style={{ color: '#a1a1aa' }}>
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div
      className="admin-data-page"
      style={containerStyle}
    >
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>
        Manage Orders
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>USER</th>
              <th style={thStyle}>TOTAL</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    color: '#a1a1aa'
                  }}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr
                  key={order._id}
                  style={rowStyle}
                >
                  {/* ORDER ID */}
                  <td style={tdStyle}>
                    {order._id
                      ? `${order._id.substring(0, 8)}...`
                      : 'N/A'}
                  </td>

                  {/* USER */}
                  <td style={tdStyle}>
                    {order.user?.name ||
                      order.user?.email ||
                      'Deleted User'}
                  </td>

                  {/* TOTAL */}
                  <td style={tdStyle}>
                    ₹{Number(order.totalAmount || order.amount || 0).toFixed(2)}
                  </td>

                  {/* DATE */}
                  <td style={tdStyle}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  {/* STATUS */}
                  <td style={tdStyle}>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      style={{
                        background: '#09090b',
                        color: '#fff',
                        padding: '6px',
                        border: '1px solid #27272a',
                        borderRadius: '4px',
                        outline: 'none'
                      }}
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="paid">
                        Paid
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '30px',
  background: '#18181b',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#fafafa'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const rowStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const thStyle = {
  padding: '15px',
  textAlign: 'left',
  color: '#a1a1aa',
  fontSize: '0.9rem'
};

const tdStyle = {
  padding: '15px',
  textAlign: 'left'
};

export default AdminOrders;