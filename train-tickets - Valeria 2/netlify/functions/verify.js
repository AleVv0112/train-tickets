const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NETLIFY_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.NETLIFY_SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

exports.handler = async function (event) {
  try {
    const id = event.queryStringParameters && event.queryStringParameters.id
    const markUsed = event.queryStringParameters && event.queryStringParameters.markUsed === '1'

    if (!id) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'missing id' }) }

    const { data: ticket, error: fetchErr } = await supabase.from('tickets').select('*').eq('id', id).single()
    if (fetchErr || !ticket) return { statusCode: 404, body: JSON.stringify({ ok: false, error: 'not found' }) }

    if (markUsed) {
      const { data, error: updErr } = await supabase.from('tickets').update({ used: true }).eq('id', id).select().single()
      if (updErr) return { statusCode: 500, body: JSON.stringify({ ok: false, error: updErr.message }) }
      return { statusCode: 200, body: JSON.stringify({ ok: true, ticket: data }) }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, ticket }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) }
  }
}
