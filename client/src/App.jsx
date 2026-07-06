import { useEffect, useState } from "react";
import { api } from "./api.js";
import KpiStrip from "./components/KpiStrip.jsx";
import RestaurantTickets from "./components/RestaurantTickets.jsx";
import MonthlyTrend from "./components/MonthlyTrend.jsx";
import FoodAlcoholSplit from "./components/FoodAlcoholSplit.jsx";
import { PaymentMethodBars, MealTypeBars } from "./components/CategoryBars.jsx";
import ServerLeaderboard from "./components/ServerLeaderboard.jsx";
import LoyaltyCompare from "./components/LoyaltyCompare.jsx";

export default function App() {
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await api.health();
        const [overview, restaurants, monthly, paymentMethods, mealTypes, topServers, loyalty] =
          await Promise.all([
            api.overview(),
            api.restaurants(),
            api.monthly(),
            api.paymentMethods(),
            api.mealTypes(),
            api.topServers(),
            api.loyalty(),
          ]);
        if (cancelled) return;
        setData({ overview, restaurants, monthly, paymentMethods, mealTypes, topServers, loyalty });
        setStatus("ok");
      } catch (err) {
        if (cancelled) return;
        setErrorMsg(err.message);
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app">
      <header className="masthead">
        <div>
          <h1>
            Restaurant Visits <span className="accent">— Reporting &amp; Analytics</span>
          </h1>
          <div className="subtitle">Practicum I · live MySQL connection</div>
        </div>
        <span className={`status-pill ${status === "error" ? "error" : "ok"}`}>
          {status === "loading" && "Connecting…"}
          {status === "ok" && "DB connected"}
          {status === "error" && "Connection failed"}
        </span>
      </header>

      {status === "loading" && <div className="loading">Pulling tickets off the rail…</div>}

      {status === "error" && (
        <div className="error-box">
          Could not reach the API or database: {errorMsg}
          <br />
          Make sure the server is running (`npm run start` in /server) and your .env
          credentials are correct.
        </div>
      )}

      {status === "ok" && data && (
        <>
          <KpiStrip overview={data.overview} />

          <section className="section">
            <div className="section-head">
              <span className="tag">By restaurant</span>
              <h2>Performance per location</h2>
              <span className="note">{data.restaurants.length} restaurants</span>
            </div>
            <RestaurantTickets restaurants={data.restaurants} />
          </section>

          <section className="section">
            <div className="section-head">
              <span className="tag">Trend</span>
              <h2>Visits &amp; revenue by month</h2>
            </div>
            <div className="panel">
              <MonthlyTrend monthly={data.monthly} />
            </div>
          </section>

          <section className="section">
            <div className="grid-2">
              <div className="panel">
                <div className="section-head">
                  <span className="tag">Mix</span>
                  <h2>Food vs. alcohol revenue</h2>
                </div>
                <FoodAlcoholSplit overview={data.overview} />
              </div>
              <div className="panel">
                <div className="section-head">
                  <span className="tag">Segment</span>
                  <h2>Loyalty members vs. not</h2>
                </div>
                <LoyaltyCompare loyalty={data.loyalty} />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="grid-2">
              <div className="panel">
                <div className="section-head">
                  <span className="tag">Payment</span>
                  <h2>Visits by payment method</h2>
                </div>
                <PaymentMethodBars data={data.paymentMethods} />
              </div>
              <div className="panel">
                <div className="section-head">
                  <span className="tag">Daypart</span>
                  <h2>Visits by meal type</h2>
                </div>
                <MealTypeBars data={data.mealTypes} />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <span className="tag">Staff</span>
              <h2>Top 10 servers by tips</h2>
            </div>
            <div className="panel">
              <ServerLeaderboard servers={data.topServers} />
            </div>
          </section>

          <div className="footer-note">
            Data source: live MySQL — restaurant / server / customer / meal_type /
            payment_method / server_assignment / visit. Generated for CS5200 Practicum I, Part H.
          </div>
        </>
      )}
    </div>
  );
}
