# v1.0.0
# { "Depends": "py-genlayer:latest" }

from genlayer import *

import json
import typing


class NewsVerifier(gl.Contract):
    has_verified: bool
    last_result: str
    last_url: str

    def __init__(self):
        self.has_verified = False
        self.last_result = ""
        self.last_url = ""

    @gl.public.write
    def verify_news(self, url: str) -> typing.Any:
        """
        Verifies the credibility of a news article given its URL.
        Uses Non-Comparative Equivalence Principle as per GenLayer SDK docs.
        """

        def leader_task() -> str:
            try:
                # 1. Fetch the article content using GenLayer's web access
                # precise API from docs: genlayer.gl.nondet.web.render
                article_content = gl.nondet.web.render(url, mode="text")
                
                # 2. Construct the prompt for the LLM
                truncated_content = article_content[:15000]
                if not truncated_content:
                    return json.dumps({"error": "Empty content fetched from URL"}, sort_keys=True)

                prompt = f"""You are a neutral, objective AI fact-checker.
Your task is to analyze the credibility of the following news article content.

ARTICLE CONTENT (Truncated):
{truncated_content}

INSTRUCTIONS:
1. Analyse the text for logical fallacies, emotional manipulation, and potential bias.
2. Cross-reference claims with your general knowledge base.
3. Assign a "Trust Score" from 0 to 100 (0 = Fake/Malicious, 100 = Highly Credible).
4. Provide a brief summary (max 2 sentences) of why you gave this score.
5. List up to 3 key facts extracted from the article.

OUTPUT FORMAT:
You must return a valid JSON object with the following structure (no markdown formatting):
{{
    "trust_score": <integer>,
    "summary": "<string>",
    "bias_level": "<Low/Medium/High>",
    "key_facts": ["<fact1>", "<fact2>", "<fact3>"]
}}
"""
                # 3. Call the LLM
                # precise API from docs: genlayer.gl.nondet.exec_prompt
                result = gl.nondet.exec_prompt(prompt)
                
                # Clean result
                result = result.replace("```json", "").replace("```", "")
                print(f"LLM Response: {result}")
                
                # Parse and validation
                parsed_result = json.loads(result)
                return json.dumps(parsed_result, sort_keys=True)

            except Exception as e:
                # Catch ALL exceptions (AttributeError, parsing, network, etc)
                print(f"Error in leader_task: {e}")
                return json.dumps({
                    "trust_score": 0,
                    "summary": f"Verification failed. Error: {str(e)}",
                    "bias_level": "Unknown",
                    "key_facts": ["System Error"]
                }, sort_keys=True)

        # 4. Execute with Non-Comparative Equivalence Principle
        # API from docs: gl.eq_principle.prompt_non_comparative
        final_result = gl.eq_principle.prompt_non_comparative(
            leader_task,
            task=f"Verify the news article at {url}",
            criteria="""
            The output must be a valid JSON string containing 'trust_score', 'summary', 'bias_level', and 'key_facts'.
            The trust_score must be an integer between 0 and 100.
            The summary must be a reasonable assessment of a news article.
            If the output is an error JSON with "error" or "System Error", it is also acceptable.
            """
        )

        # 5. Store the result
        self.last_url = url
        self.last_result = final_result
        self.has_verified = True

        return final_result

    @gl.public.view
    def get_verification_result(self) -> str:
        """
        Retrieves the last verification result.
        """
        return self.last_result

    @gl.public.view
    def get_last_url(self) -> str:
        """
        Returns the last verified URL.
        """
        return self.last_url

    @gl.public.view
    def get_has_verified(self) -> bool:
        """
        Returns whether any news has been verified.
        """
        return self.has_verified
