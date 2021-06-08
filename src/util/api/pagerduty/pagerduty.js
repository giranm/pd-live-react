import { api } from '@pagerduty/pdjs';

class PagerDuty {
  constructor(token) {
    // Replace with OAuth Workflow later on
    this.token = token;
    this.pd = api({ token: this.token });
    // this.pd = api({ token: this.token, tokenType: 'bearer' })
    this.last_polled = new Date();
    this.recent_log_entries = [];
    this.incidents = [];
  }

  pdfetch = async (endpoint, params) => {
    const myParams = { ...params }
    const endpoint_identifier = endpoint.toString().split('/').pop()
    let r = []
    // const responses = await this.pd.all({ token: this.token, tokenType: 'bearer', endpoint: `/${endpoint}`, data: myParams })
    let responses = await this.pd.all({ endpoint: `/${endpoint}`, data: myParams })
    for (let response of responses) {
      r = [...r, ...response.data[endpoint_identifier]]
    }
    return r
  }

  fetchIncidents = async (since, until) => {
    let params = {
      since: since.toISOString(),
      until: until.toISOString(),
      'include[]': 'first_trigger_log_entries',
      'statuses[]': ['triggered', 'acknowledged']
    }
    this.incidents = await this.pdfetch('incidents', params);
    return this.incidents
  }

  pollLogEntries = () => {
    // Setup params/lookback since last polling date.
    let params = {
      since: this.last_polled.toISOString().replace(/\.[\d]{3}/, ''),
      'include[]': ['incidents'],
    }

    this.pdfetch('log_entries', params).then(log_entries => {
      let add_set = new Set()
      let remove_set = new Set()
      let update_set = new Set()

      // Initial processing of log entries
      for (let log_entry of log_entries) {
        // Skip duplicate log entry in our map
        if (this.recent_log_entries.filter(x => x.id == log_entry.id).length > 0) {
          continue
        }

        // Update recent log entries into an array to drive logic 
        let log_entry_date = new Date(log_entry.created_at)
        this.recent_log_entries.push({
          date: log_entry_date,
          id: log_entry.id
        })
        if (log_entry_date > this.last_polled) {
          this.last_polled = log_entry_date
        }
        const entry_type = log_entry.type

        // Determine which set to be updated based on entry type
        if (entry_type === 'resolve_log_entry') {
          remove_set.add(log_entry)
        } else if (entry_type === 'trigger_log_entry') {
          add_set.add(log_entry)
        } else {
          update_set.add(log_entry)
        }
      }

      // Update sets of what incidents should be updated
      const add_list = [...add_set].filter(x => !remove_set.has(x))
      const update_list = [...update_set].filter(x => !remove_set.has(x) && !add_set.has(x))
      const remove_list = [...remove_set]

      // Logic for adding incidents
      for (let add_item of add_list) {
        console.log('add:', add_item)
        const incident = add_item.incident

        // This logic needs to be moved to React Component
        // table.row.add({
        //   incident_id: incident.id,
        //   number: `<a href="${incident.html_url}" target="blank">${incident.incident_number}</a>`,
        //   title: incident.title,
        //   status: incident.status,
        //   priority: incident.priority ? incident.priority.summary : '~none~',
        //   // notes: 0,
        //   created_at: moment(incident.created_at).format('l LTS [GMT]ZZ'),
        //   service_name: `<a href="${incident.service.html_url}" target="blank">${incident.service.summary}</a>`,
        //   last_log: '',
        // })
        //   .draw()
        // flashIncidentRow(incident.id)
      }

      // Logic for updating incidents
      for (let update_item of update_list) {
        console.log('update:', update_item)
        const incident = update_item.incident
        // TODO: Pull data from incident table 
        // const row = table.row(`#${incident.id}`).data()
        let row = null;

        if (!row) {
          console.log(`row not found for incident id ${incident.id}`)
          continue
        }
        row.last_log = `${(new Date(update_item.created_at)).toLocaleString()}: ${update_item.summary}`
        if (update_item.type === 'annotate_log_entry') {
          // row.notes += 1
        } else if (update_item.type === 'priority_change_log_entry') {
          row.priority = incident.priority ? incident.priority.summary : '~none~'
        } else if (update_item.type === 'acknowledge_log_entry') {
          row.status = 'acknowledged'
        } else if (update_item.type === 'unacknowledge_log_entry') {
          row.status = 'triggered'
        }
        // TODO: Update data to incident table 
        // table.row(`#${incident.id}`).data(row).draw()
        // flashIncidentRow(incident.id)
      }

      // Logic for removing incidents
      for (let remove_item of remove_list) {
        console.log('remove:', remove_item)
        const incident = remove_item.incident
        // TODO: Pull data from incident table 
        // const row = table.row(`#${incident.id}`).data()
        let row = null;
        if (!row) {
          console.log(`row not found for incident id ${incident.id}`)
          continue
        }
        // TODO: Remove data from incident table 
        // table.row(`#${incident.id}`).remove().draw()
      }
    })
  }

}

export default PagerDuty;