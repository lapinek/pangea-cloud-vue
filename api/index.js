import express from 'express'
import { PangeaConfig, AuditService, PangeaErrors, RedactService } from 'pangea-node-sdk'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import util from 'node:util'

/**
 * Allow use of a custom location for the `.env` file.
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: __dirname + '/../.env.local' })

/**
 * Set up Pangea Secure Audit Service.
 * @see {@link https://pangea.cloud/docs/audit/}
 */
const auditToken = process.env.PANGEA_AUDIT_TOKEN
const auditConfig = new PangeaConfig({
  domain: process.env.PANGEA_AUDIT_DOMAIN,
  configID: process.env.PANGEA_AUDIT_CONFIG_ID
})
const audit = new AuditService(auditToken, auditConfig)

/**
 * Set up Pangea Redact Service.
 * @see {@link https://pangea.cloud/docs/redact/}
 */
const redactToken = process.env.PANGEA_REDACT_TOKEN
const redactConfig = new PangeaConfig({
  domain: process.env.PANGEA_REDACT_DOMAIN
})
const redact = new RedactService(redactToken, redactConfig)

const app = express()
const PORT = process.env.port || 3000

/**
 * Parse request body.
 */
app.use(express.json())

/**
 * Handle audit log POST from the SPA.
 */
app.post('/audit-log', (req, res) => {
  (async () => {
    let data = req.body
    /**
     * Remove sensitive data from the log content.
     */
    try {
      const redactResponse = await redact.redactStructured(data)
      if (redactResponse.success) {
        data = redactResponse.result.redacted_data
        console.log('Redacted sensitive information from the log content.')
      } else {
        data = {
          message: `Failed to redact sensitive data from the log content: ${redactResponse.code} ${redactResponse.result}. Aborting.`
        }
      }
    } catch (e) {
      if (e instanceof PangeaErrors.APIError) {
        console.log('Redact error:', e.summary, e.pangeaResponse)
      } else {
        // throw e
        console.log('Node.js error:', e.message)
      }
    }

    try {
      console.log(`Logging: ${data.message}`)
      /**
       * Send a single audit log data.
       * Other available methods are can be found in the API docs:
       * @see {@link https://pangea.cloud/docs/api/audit/?focus=audit}
       */
      const logResponse = await audit.log(data, { verbose: true })
      console.log(`Response: ${util.inspect(logResponse.result)}`)
    } catch (e) {
      if (e instanceof PangeaErrors.APIError) {
        console.log('Secure Audit Log error:', e.summary, e.pangeaResponse)
      } else {
        // throw e
        console.log('Node.js error:', e.message)
      }
    }
  })()
  res.send('Audit Log executed.')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
