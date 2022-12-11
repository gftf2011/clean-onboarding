/**
 * Bootstrap must be the first import to load env values
 */
import '../bootstrap';
import { loader } from '../loaders';
import broker from '../config/broker';

loader().then(() => {
  broker().then(() => {
    console.log(`broker running`);
  });
});
