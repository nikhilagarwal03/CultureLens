/** @jest-environment node */

import { callLLM } from './llm';
import { callOpenRouter, isOpenRouterConfigured } from './openrouter';



jest.mock('./openrouter', () => ({
  callOpenRouter: jest.fn(),
  isOpenRouterConfigured: jest.fn(),
}));

const mockedCallOpenRouter = callOpenRouter as jest.MockedFunction<typeof callOpenRouter>;
const mockedIsOpenRouterConfigured =
  isOpenRouterConfigured as jest.MockedFunction<typeof isOpenRouterConfigured>;

describe('LLM integration service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsOpenRouterConfigured.mockReturnValue(true);
  });

  it('calls OpenRouter and returns output', async () => {
    mockedCallOpenRouter.mockResolvedValue({
      reference: 'Roman Empire meme',
      originCulture: 'Global internet culture',
      culturalImpact: 'Widely discussed online.',
      localAnalogy: 'A recurring meme reference.',
      context: 'Appears in social conversations.',
    });

    const output = await callLLM({
      text: 'Why roman empire meme?',
      userCountry: 'India',
      userLanguage: 'en',
    });

    expect(mockedCallOpenRouter).toHaveBeenCalledTimes(1);
    expect(output.reference).toBe('Roman Empire meme');
  });
});
