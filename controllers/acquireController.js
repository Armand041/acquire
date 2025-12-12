const { fetchKunna } = require('../utils/fetchData');

/**
 * Endpoint POST /acquire/data
 * Body: { timeStart, timeEnd }
 * Devuelve: { columns, values }
 */

async function acquireData(req, res) {
    try {
        const { timeStart, timeEnd } = req.body;

        if (!timeStart || !timeEnd) {
            return res.status(400).json({
                error: "Missing timeStart or timeEnd"
            });
        }

        const startDate = new Date(timeStart);
        const endDate = new Date(timeEnd);

        const result = await fetchKunna(startDate, endDate);

        res.status(200).json({
            status: "success",
            data: result,
            source: "kunna",
            timestamp: new Date().toISOString()
        });
    
    } catch (err) {
        console.error("[ACQUIRE] Error:", err.message);
        res.status(500).json({
            error: err.message,
            status: "failed"
        });
    }
}

module.exports = {
    acquireData
};