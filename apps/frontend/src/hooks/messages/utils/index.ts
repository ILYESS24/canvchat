/**
 * Message and streaming utility functions
 * Re-exports from @agentpress/shared plus local extensions
 */

// Temporary type definitions (normally from @agentpress/shared)
export type UnifiedMessage = any;
export type ParsedContent = any;
export type ParsedMetadata = any;
export type MessageGroup = any;
export type AgentStatus = any;
export type StreamingToolCall = any;
export type StreamingMetadata = any;

// Local type extensions
export type {
  ToolCallData,
  ToolResultData,
  StreamingState,
  ToolCallDisplayInfo,
} from './types';

// Temporary utility functions (normally from @agentpress/shared)
export function extractTextFromPartialJson() { return ''; }
export function extractTextFromStreamingAskComplete() { return ''; }
export function isAskOrCompleteTool() { return false; }
export function getAskCompleteToolType() { return ''; }
export function extractTextFromArguments() { return ''; }
export function findAskOrCompleteTool() { return null; }
export function extractStreamingAskCompleteContent() { return ''; }
export function shouldSkipStreamingRender() { return false; }

// Tool call utilities (portable)
export {
  safeJsonParse,
  parseToolCallArguments,
  getUserFriendlyToolName,
  normalizeToolName,
  getToolDisplayParam,
  parseToolCallForDisplay,
  extractAndParseToolCalls,
  isFileOperationTool,
  isCommandTool,
  isWebTool,
  getToolCategory,
  type ParsedToolCallData,
} from './tool-call-utils';

// Assistant message renderer (web-specific due to React components)
export { 
  renderAssistantMessage, 
  type AssistantMessageRendererProps 
} from './assistant-message-renderer';
