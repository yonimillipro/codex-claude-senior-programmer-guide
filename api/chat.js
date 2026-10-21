import { createChatHandler } from '../server/chat-handler.js';
const handle = createChatHandler();
export const GET = handle;
export const POST = handle;
export const OPTIONS = handle;
export const PUT = handle;
export const DELETE = handle;
