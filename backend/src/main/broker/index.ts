/**
 * Bootstrap must be the first import to load env values
 */
import '../bootstrap';
import { loader } from '../loaders';
import setupQueues from '../config/queues';

loader().then(() => {
  setupQueues();
});
