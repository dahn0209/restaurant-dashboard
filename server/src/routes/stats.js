import { Router } from "express";
import { query } from "../db.js";

const router = Router();

/**
 * GET /api/overview
 * Headline numbers for the top KPI strip.
 */
router.get("/overview", async (req, res, next) => {
  try {
    const [row] = await query(`
      SELECT
        COUNT(*)                              AS total_visits,
        COUNT(DISTINCT restaurant_id)         AS total_restaurants,
        COUNT(DISTINCT customer_id)           AS unique_customers,
        COALESCE(SUM(food_bill), 0)           AS total_food,
        COALESCE(SUM(alcohol_bill), 0)        AS total_alcohol,
        COALESCE(SUM(tip_amount), 0)          AS total_tips,
        COALESCE(SUM(food_bill + alcohol_bill), 0) AS total_revenue
      FROM visit;
    `);
    res.json(row);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/restaurants
 * Per-restaurant breakdown: visits, unique customers, revenue, food vs alcohol,
 * average party size / wait time. Powers the restaurant "ticket" cards.
 */
router.get("/restaurants", async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        r.restaurant_id,
        r.restaurant_name,
        r.city,
        r.state,
        r.has_table_service,
        COUNT(v.visit_id)                          AS visits,
        COUNT(DISTINCT v.customer_id)               AS unique_customers,
        COALESCE(SUM(v.food_bill), 0)                AS food_total,
        COALESCE(SUM(v.alcohol_bill), 0)             AS alcohol_total,
        COALESCE(SUM(v.food_bill + v.alcohol_bill), 0) AS revenue,
        ROUND(AVG(v.party_size), 2)                 AS avg_party_size,
        ROUND(AVG(v.wait_time), 1)                  AS avg_wait_time,
        ROUND(AVG(v.food_discount_percentage), 2)   AS avg_discount_pct,
        ROUND(100 * SUM(v.ordered_alcohol) / COUNT(v.visit_id), 1) AS alcohol_attach_rate
      FROM restaurant r
      LEFT JOIN visit v ON v.restaurant_id = r.restaurant_id
      GROUP BY r.restaurant_id, r.restaurant_name, r.city, r.state, r.has_table_service
      ORDER BY visits DESC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/monthly
 * Visit counts and revenue grouped by year + month, for the trend line.
 */
router.get("/monthly", async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        YEAR(visit_date)  AS yr,
        MONTH(visit_date) AS mo,
        COUNT(*)          AS visits,
        COALESCE(SUM(food_bill + alcohol_bill), 0) AS revenue
      FROM visit
      WHERE visit_date IS NOT NULL
      GROUP BY YEAR(visit_date), MONTH(visit_date)
      ORDER BY yr, mo;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/payment-methods
 * Visit count + revenue by payment method.
 */
router.get("/payment-methods", async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        pm.payment_method_name AS name,
        COUNT(*)                AS visits,
        COALESCE(SUM(v.food_bill + v.alcohol_bill), 0) AS revenue
      FROM visit v
      JOIN payment_method pm ON pm.payment_method_id = v.payment_method_id
      GROUP BY pm.payment_method_name
      ORDER BY visits DESC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/meal-types
 * Visit count + average party size by meal type (breakfast/lunch/dinner...).
 */
router.get("/meal-types", async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        mt.meal_type_name AS name,
        COUNT(*)           AS visits,
        ROUND(AVG(v.party_size), 2) AS avg_party_size
      FROM visit v
      JOIN meal_type mt ON mt.meal_type_id = v.meal_type_id
      GROUP BY mt.meal_type_name
      ORDER BY visits DESC;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/servers/top
 * Top 10 servers by total tips earned, with visit count for context.
 */
router.get("/servers/top", async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        s.server_emp_id,
        s.server_name,
        COUNT(*)                       AS visits,
        COALESCE(SUM(v.tip_amount), 0) AS total_tips,
        ROUND(AVG(v.tip_amount), 2)    AS avg_tip
      FROM visit v
      JOIN server s ON s.server_emp_id = v.server_emp_id
      GROUP BY s.server_emp_id, s.server_name
      ORDER BY total_tips DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/loyalty
 * Visits + revenue split by loyalty-member status.
 */
router.get("/loyalty", async (req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        c.loyalty_member AS loyalty_member,
        COUNT(*)          AS visits,
        COALESCE(SUM(v.food_bill + v.alcohol_bill), 0) AS revenue,
        ROUND(AVG(v.tip_amount), 2) AS avg_tip
      FROM visit v
      JOIN customer c ON c.customer_id = v.customer_id
      GROUP BY c.loyalty_member;
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
