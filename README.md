# Contract that store the sender's address & anybody is able to read the latest sender's address. To access such data from ouside of TVM

# Contract Elements : 

## parameters passed to our recv_internal function
- msg_value - this parameter is telling us how many TON coin (or grams) are received with this message
- in_msg - this is a complete message that we've received, with all the information about who sent it etc. 
- in_msg_body - this is an actual "readable" part of the message that we received. It has a type of slice, because it is part of the Cell, it indicates the "address" from which part of the cell we should start reading if we want to read this slice parameter.

## Parsing in_msg
Whenever we want to handle an internal message, before we even start reading the meaningfulin_msg_body part, we need to first understand what kind of internal message we've received.

- the begin_parse() is telling us from where we should start parsing, it gives us the pointer to a very first bit of the in_msg Cell.
- Then we parse a 4 bit integer by calling load_uint(4) and assign the result to an int variable flags.
- Once we are going to call some more ~load_{*} on the cs variable, we will actually continue parsing from the place the previous ~load_{*} finished.

In case we will try to parse something that doesn't actually exist in the cell - our contract will exit with code 9
When we want to create a variable that stores address, we always use slice type, so we only store the pointer from where the memory should read the address, once it's needed.

# Using persistent storage
In order to store the same data in our c4 persistent storage, we are going to use FunC standard function set_data. This function is accepting and storing a Cell.

we have a smartcontract that is able to write a sender's address into the persistant storage! Every time our contract will receive an internal message, it will replace the Cell that is stored in c4 with a new cell that will have a new sender's address.

# Using getter methods
To make our data accessible ouside the TVM, we are going to create a function and use specifier method_id. If function has this specifier set - then it can be called in lite-client or ton-explorer as a get-method by its name.

As you can see, we are using the begin_parse() again to get a pointer, from which we are going to parse the Cell stored in c4 storage.

To load the stored address we are using ~load_msg_addr to load the address.

# Contract V2 : Update the contract & add new funtionalities 
- store in c4 the address of the sender of the last message and the integer total - a 32-bit unsigned number;
- when receiving an internal incoming message, the contract must take the address from in_msg, a 32-bit unsigned integer from the body of the message, add it to total, and store the address and amount in the contract data;
- The smart contract must have a get_sum method that allows you to return the total value;