exports.verifyPost = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  // $id: 'http://example.com/schemas/foo.json',
  type: 'object',
  additionalProperties: false,
  required: ['presentation'],
  properties: {
    presentation: {
      type: 'object'
    },
  }
};
