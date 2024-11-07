import { Context } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import { saveService } from '../services/dataService.ts';

export async function registerService(context: Context) {
  try {
    const body = await context.request.body.json();
    if (!body) {
      context.response.status = 400;
      context.response.body = { error: 'Missing request body' };
      return;
    }

    const { ID, Name, Address, Port, Tags, Check } = body;
    if (!Name || !Address || !Port) {
      context.response.status = 400;
      context.response.body = { error: 'Missing required fields' };
      return;
    }

    const serviceData = {
      name: Name,
      domain: Address,
      port: Port,
      tags: Tags || [],
      status: 'unknown',
      checkType: Check?.Type || 'http',
      checkURL: Check?.HTTP || `http://${Address}:${Port}/health`,
      lastChecked: null,
    };

    const serviceId = await saveService(ID, serviceData);
    context.response.body = {
      message: 'Service registered successfully',
      serviceId,
    };
  } catch (error) {
    console.error('Error registering service:', error);
    context.response.status = 400;
    context.response.body = { error: 'Invalid request format' };
  }
}
