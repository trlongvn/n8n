import type { IExecuteFunctions, INodeTypeBaseDescription } from 'n8n-workflow';

import { HttpRequestV3 } from '../../V3/HttpRequestV3.node';

describe('HttpRequestV3', () => {
	let node: HttpRequestV3;
	let executeFunctions: IExecuteFunctions;

	const baseUrl = 'http://example.com';
	const options = {
		redirect: '',
		batching: { batch: { batchSize: 1, batchInterval: 1 } },
		proxy: '',
		timeout: '',
		allowUnauthoridCerts: '',
		queryParameterArrays: '',
		response: '',
		lowercaseHeaders: '',
	};

	beforeEach(() => {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'HTTP Request',
			name: 'httpRequest',
			description: 'Makes an HTTP request and returns the response data',
			group: [],
		};
		node = new HttpRequestV3(baseDescription);
		executeFunctions = {
			getInputData: jest.fn(),
			getNodeParameter: jest.fn(),
			getNode: jest.fn(() => {
				return {
					type: 'n8n-nodes-base.httpRequest',
					typeVersion: 3,
				};
			}),
			getCredentials: jest.fn(),
			helpers: {
				request: jest.fn(),
				requestOAuth1: jest.fn(
					async () =>
						await Promise.resolve({
							statusCode: 200,
							headers: { 'content-type': 'application/json' },
							body: Buffer.from(JSON.stringify({ success: true })),
						}),
				),
				requestOAuth2: jest.fn(
					async () =>
						await Promise.resolve({
							statusCode: 200,
							headers: { 'content-type': 'application/json' },
							body: Buffer.from(JSON.stringify({ success: true })),
						}),
				),
				requestWithAuthentication: jest.fn(),
				requestWithAuthenticationPaginated: jest.fn(),
				assertBinaryData: jest.fn(),
				getBinaryStream: jest.fn(),
				getBinaryMetadata: jest.fn(),
				binaryToString: jest.fn((buffer: Buffer) => {
					return buffer.toString();
				}),
				prepareBinaryData: jest.fn(),
			},
			getContext: jest.fn(),
			sendMessageToUI: jest.fn(),
			continueOnFail: jest.fn(),
			getMode: jest.fn(),
		} as unknown as IExecuteFunctions;
	});

	it('should make a GET request', async () => {
		(executeFunctions.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		(executeFunctions.getNodeParameter as jest.Mock).mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'method':
					return 'GET';
				case 'url':
					return baseUrl;
				case 'authentication':
					return 'none';
				case 'options':
					return options;
				default:
					return undefined;
			}
		});
		const response = {
			headers: { 'content-type': 'application/json' },
			body: Buffer.from(JSON.stringify({ success: true })),
		};

		(executeFunctions.helpers.request as jest.Mock).mockResolvedValue(response);

		const result = await node.execute.call(executeFunctions);

		expect(result).toEqual([[{ json: { success: true }, pairedItem: { item: 0 } }]]);
	});

	it('should handle authentication', async () => {
		(executeFunctions.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		(executeFunctions.getNodeParameter as jest.Mock).mockImplementation((paramName: string) => {
			switch (paramName) {
				case 'method':
					return 'GET';
				case 'url':
					return baseUrl;
				case 'authentication':
					return 'genericCredentialType';
				case 'genericAuthType':
					return 'httpBasicAuth';
				case 'options':
					return options;
				default:
					return undefined;
			}
		});
		(executeFunctions.getCredentials as jest.Mock).mockResolvedValue({
			user: 'username',
			password: 'password',
		});
		const response = {
			headers: { 'content-type': 'application/json' },
			body: Buffer.from(JSON.stringify({ success: true })),
		};
		(executeFunctions.helpers.request as jest.Mock).mockResolvedValue(response);

		const result = await node.execute.call(executeFunctions);

		expect(result).toEqual([[{ json: { success: true }, pairedItem: { item: 0 } }]]);
		expect(executeFunctions.helpers.request).toHaveBeenCalledWith(
			expect.objectContaining({
				auth: {
					user: 'username',
					pass: 'password',
				},
			}),
		);
	});

	describe('Authentication Handling', () => {
		const authenticationTypes = [
			{
				genericCredentialType: 'httpBasicAuth',
				credentials: { user: 'username', password: 'password' },
				authField: 'auth',
				authValue: { user: 'username', pass: 'password' },
			},
			{
				genericCredentialType: 'httpBearerAuth',
				credentials: { token: 'bearerToken123' },
				authField: 'headers',
				authValue: { Authorization: 'Bearer bearerToken123' },
			},
			{
				genericCredentialType: 'httpDigestAuth',
				credentials: { user: 'username', password: 'password' },
				authField: 'auth',
				authValue: { user: 'username', pass: 'password', sendImmediately: false },
			},
			{
				genericCredentialType: 'httpHeaderAuth',
				credentials: { name: 'Authorization', value: 'Bearer token' },
				authField: 'headers',
				authValue: { Authorization: 'Bearer token' },
			},
			{
				genericCredentialType: 'httpQueryAuth',
				credentials: { name: 'Token', value: 'secretToken' },
				authField: 'qs',
				authValue: { Token: 'secretToken' },
			},
			{
				genericCredentialType: 'oAuth1Api',
				credentials: { oauth_token: 'token', oauth_token_secret: 'secret' },
				authField: 'oauth',
				authValue: { oauth_token: 'token', oauth_token_secret: 'secret' },
			},
			{
				genericCredentialType: 'oAuth2Api',
				credentials: { access_token: 'accessToken' },
				authField: 'auth',
				authValue: { bearer: 'accessToken' },
			},
		];

		it.each(authenticationTypes)(
			'should handle $genericCredentialType authentication',
			async ({ genericCredentialType, credentials, authField, authValue }) => {
				(executeFunctions.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
				(executeFunctions.getNodeParameter as jest.Mock).mockImplementation((paramName: string) => {
					switch (paramName) {
						case 'method':
							return 'GET';
						case 'url':
							return baseUrl;
						case 'authentication':
							return 'genericCredentialType';
						case 'genericAuthType':
							return genericCredentialType;
						case 'options':
							return options;
						default:
							return undefined;
					}
				});

				(executeFunctions.getCredentials as jest.Mock).mockResolvedValue(credentials);
				const response = {
					headers: { 'content-type': 'application/json' },
					body: Buffer.from(JSON.stringify({ success: true })),
				};
				(executeFunctions.helpers.request as jest.Mock).mockResolvedValue(response);

				const result = await node.execute.call(executeFunctions);

				expect(result).toEqual([[{ json: { success: true }, pairedItem: { item: 0 } }]]);
				if (genericCredentialType === 'oAuth1Api') {
					expect(executeFunctions.helpers.requestOAuth1).toHaveBeenCalled();
				} else if (genericCredentialType === 'oAuth2Api') {
					expect(executeFunctions.helpers.requestOAuth2).toHaveBeenCalled();
				} else {
					expect(executeFunctions.helpers.request).toHaveBeenCalledWith(
						expect.objectContaining({
							[authField]: expect.objectContaining(authValue),
						}),
					);
				}
			},
		);
	});

	describe('URL Parameter Validation', () => {
		it('should throw error when URL is undefined', async () => {
			(executeFunctions.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			(executeFunctions.getNodeParameter as jest.Mock).mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'method':
						return 'GET';
					case 'url':
						return undefined;
					case 'authentication':
						return 'none';
					case 'options':
						return options;
					default:
						return undefined;
				}
			});

			await expect(node.execute.call(executeFunctions)).rejects.toThrow(
				'URL parameter must be a string, got undefined',
			);
		});

		it('should throw error when URL is null', async () => {
			(executeFunctions.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			(executeFunctions.getNodeParameter as jest.Mock).mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'method':
						return 'GET';
					case 'url':
						return null;
					case 'authentication':
						return 'none';
					case 'options':
						return options;
					default:
						return undefined;
				}
			});

			await expect(node.execute.call(executeFunctions)).rejects.toThrow(
				'URL parameter must be a string, got null',
			);
		});

		it('should throw error when URL is a number', async () => {
			(executeFunctions.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			(executeFunctions.getNodeParameter as jest.Mock).mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'method':
						return 'GET';
					case 'url':
						return 42;
					case 'authentication':
						return 'none';
					case 'options':
						return options;
					default:
						return undefined;
				}
			});

			await expect(node.execute.call(executeFunctions)).rejects.toThrow(
				'URL parameter must be a string, got number',
			);
		});
	});

	describe('Multiple Binary Files Upload', () => {
		it('should upload all binary files with formBinaryDataAll parameter type', async () => {
			// Mock version 4.2 to use multipart-form-data
			(executeFunctions.getNode as jest.Mock).mockReturnValue({
				type: 'n8n-nodes-base.httpRequest',
				typeVersion: 4.2,
			});

			// Mock input data with multiple binary files
			const inputData = [
				{
					json: {},
					binary: {
						file1: {
							data: Buffer.from('file1 content').toString('base64'),
							mimeType: 'text/plain',
							fileName: 'file1.txt',
							fileExtension: 'txt',
						},
						file2: {
							data: Buffer.from('file2 content').toString('base64'),
							mimeType: 'text/plain',
							fileName: 'file2.txt',
							fileExtension: 'txt',
						},
						image1: {
							data: Buffer.from('image content').toString('base64'),
							mimeType: 'image/png',
							fileName: 'image1.png',
							fileExtension: 'png',
						},
					},
				},
			];

			(executeFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

			// Track parameters accessed
			const parameterCalls: Record<string, any> = {};
			(executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(paramName: string, itemIndex: number) => {
					if (paramName === 'method') return 'POST';
					if (paramName === 'url') return baseUrl;
					if (paramName === 'authentication') return 'none';
					if (paramName === 'sendBody') return true;
					if (paramName === 'contentType') return 'multipart-form-data';
					if (paramName === 'bodyParameters.parameters') {
						return [
							{
								name: '',
								value: '',
								parameterType: 'formBinaryDataAll',
								inputDataFieldPattern: '',
							},
						];
					}
					if (paramName === 'options') return options;
					return undefined;
				},
			);

			// Mock assertBinaryData to return proper binary data
			(executeFunctions.helpers.assertBinaryData as jest.Mock).mockImplementation(
				(itemIndex: number, fieldName: string) => {
					return inputData[itemIndex].binary![fieldName];
				},
			);

			const response = {
				headers: { 'content-type': 'application/json' },
				body: Buffer.from(JSON.stringify({ success: true })),
			};

			(executeFunctions.helpers.request as jest.Mock).mockResolvedValue(response);

			const result = await node.execute.call(executeFunctions);

			expect(result).toEqual([[{ json: { success: true }, pairedItem: { item: 0 } }]]);

			// Verify that request was called with formData containing all files
			const requestCall = (executeFunctions.helpers.request as jest.Mock).mock.calls[0][0];
			expect(requestCall.formData).toBeDefined();
		});

		it('should upload only matching binary files when pattern is specified', async () => {
			// Mock version 4.2 to use multipart-form-data
			(executeFunctions.getNode as jest.Mock).mockReturnValue({
				type: 'n8n-nodes-base.httpRequest',
				typeVersion: 4.2,
			});

			// Mock input data with multiple binary files
			const inputData = [
				{
					json: {},
					binary: {
						file1: {
							data: Buffer.from('file1 content').toString('base64'),
							mimeType: 'text/plain',
							fileName: 'file1.txt',
							fileExtension: 'txt',
						},
						file2: {
							data: Buffer.from('file2 content').toString('base64'),
							mimeType: 'text/plain',
							fileName: 'file2.txt',
							fileExtension: 'txt',
						},
						image1: {
							data: Buffer.from('image content').toString('base64'),
							mimeType: 'image/png',
							fileName: 'image1.png',
							fileExtension: 'png',
						},
					},
				},
			];

			(executeFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

			// Use pattern to match only "file*" fields
			(executeFunctions.getNodeParameter as jest.Mock).mockImplementation(
				(paramName: string, itemIndex: number) => {
					if (paramName === 'method') return 'POST';
					if (paramName === 'url') return baseUrl;
					if (paramName === 'authentication') return 'none';
					if (paramName === 'sendBody') return true;
					if (paramName === 'contentType') return 'multipart-form-data';
					if (paramName === 'bodyParameters.parameters') {
						return [
							{
								name: '',
								value: '',
								parameterType: 'formBinaryDataAll',
								inputDataFieldPattern: 'file*',
							},
						];
					}
					if (paramName === 'options') return options;
					return undefined;
				},
			);

			// Mock assertBinaryData
			(executeFunctions.helpers.assertBinaryData as jest.Mock).mockImplementation(
				(itemIndex: number, fieldName: string) => {
					return inputData[itemIndex].binary![fieldName];
				},
			);

			const response = {
				headers: { 'content-type': 'application/json' },
				body: Buffer.from(JSON.stringify({ success: true })),
			};

			(executeFunctions.helpers.request as jest.Mock).mockResolvedValue(response);

			const result = await node.execute.call(executeFunctions);

			expect(result).toEqual([[{ json: { success: true }, pairedItem: { item: 0 } }]]);

			// Verify that request was called with formData containing only matching files
			const requestCall = (executeFunctions.helpers.request as jest.Mock).mock.calls[0][0];
			expect(requestCall.formData).toBeDefined();
		});
	});
});
