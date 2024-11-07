import { Context } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import { deleteService } from '../services/dataService.ts';

export async function unregisterService(context: Context) {
  const serviceID = context.params.service_id;
  if (!serviceID) {
    context.response.status = 400;
    context.response.body = { error: 'Missing service ID in request' };
    return;
  }

  const result = await deleteService(serviceID);
  if (result) {
    context.response.body = { message: 'Service unregistered successfully' };
  } else {
    context.response.status = 404;
    context.response.body = { error: 'Service not found' };
  }
}
