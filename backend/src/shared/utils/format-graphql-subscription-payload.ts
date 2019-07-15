import { GraphQlOperationPayload } from '../type';
import { DocumentNode, FieldNode, OperationDefinitionNode, parse, SelectionSetNode } from 'graphql';

export const formatGraphQlSubscriptionPayload = (
  payload: any,
  operation: GraphQlOperationPayload,
) => {
  let document: DocumentNode;
  try {
    document = parse(operation.query);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
    throw Error('Bad subscription format');
  }

  if (
    !document.definitions ||
    !document.definitions[0] ||
    document.definitions[0].kind !== 'OperationDefinition' ||
    (document.definitions[0] as OperationDefinitionNode).operation !== 'subscription'
  ) {
    throw Error('Bad subscription format');
  }

  const operationDefinitionNode = document.definitions[0] as OperationDefinitionNode;

  let validatedPayload;
  if ((operationDefinitionNode.selectionSet.selections[0] as FieldNode).selectionSet) {
    validatedPayload = validatePayload(payload, operationDefinitionNode.selectionSet);
  } else {
    if (typeof payload !== 'object') {
      validatedPayload = {
        [(operationDefinitionNode.selectionSet.selections[0] as FieldNode).name.value]: payload,
      };
    } else {
      throw Error('Payload does not fit subscription format');
    }
  }

  return {
    data: validatedPayload,
  };
};

const validatePayload = (payload: any, selectionSet: SelectionSetNode) => {
  if (typeof payload !== 'object') {
    if (!selectionSet) {
      return payload;
    } else {
      throw Error('Payload does not fit subscription format');
    }
  }
  return selectionSet.selections.reduce((validatedPayload, selection) => {
    selection = selection as FieldNode;

    if (!payload[selection.name.value]) {
      throw Error('Payload does not fit subscription format');
    }

    validatedPayload[selection.name.value] = validatePayload(
      payload[selection.name.value],
      selection.selectionSet,
    );

    return validatedPayload;
  }, {});
};
