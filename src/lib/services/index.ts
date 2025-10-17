/**
 * Service exports
 * Centralized export of all microservice API clients
 */

export { accountService, default as account } from './account.service';
export { chatService, default as chat } from './chat.service';
export { fileService, default as file } from './file.service';
export { notificationService, default as notification } from './notification.service';
export { searchService, default as search } from './search.service';
export { walletService, default as wallet } from './wallet.service';

// Combined services object
import accountService from './account.service';
import chatService from './chat.service';
import fileService from './file.service';
import notificationService from './notification.service';
import searchService from './search.service';
import walletService from './wallet.service';

export const services = {
  account: accountService,
  chat: chatService,
  file: fileService,
  notification: notificationService,
  search: searchService,
  wallet: walletService,
} as const;

export default services;
