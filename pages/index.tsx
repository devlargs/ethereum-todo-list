import { Box, Button, Checkbox, Divider, Heading, Input, Spinner } from '@chakra-ui/react';
import { getWeb3Modal, initWeb3 } from '@hooks/useWeb3';
import TODO_LIST from '@solidity/build/contracts/TodoList.json';
import { FC, useCallback, useState } from 'react';
import Web3 from 'web3';

const Index: FC = () => {
  const [web3, setWeb3] = useState<Web3>();
  const web3Modal = getWeb3Modal();
  const [account, setAccount] = useState('');
  const [taskCount, setTaskCount] = useState<string | number>(0);
  const [text, setText] = useState<string>('');
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [renderLoading, setRenderLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<
    Array<{
      completed: boolean;
      content: string;
      id: string;
    }>
  >([]);

  // console.log(abi, networks[5777].address);

  const onLogout = async (): Promise<void> => {
    if (web3?.currentProvider && (web3.currentProvider as any)?.close) {
      await (web3.currentProvider as any)?.close();
    }

    await web3Modal.clearCachedProvider();
    setAccount('');
  };

  const subscribeProvider = useCallback(
    async (provider, locWeb3) => {
      if (!provider.on) {
        return;
      }
      provider.on('close', onLogout);
      provider.on('accountsChanged', async (accounts: string[]) => {
        setAccount(accounts[0]);
      });
      // provider.on('chainChanged', async (chainId: number) => {
      //   const networkId = await locWeb3.eth.net.getId();
      //   // setChainId(chainId);
      //   // setNetworkId(networkId);
      // });

      // provider.on('networkChanged', async (networkId: number) => {
      //   const chainId = await locWeb3.eth.chainId();
      //   // setChainId(chainId);
      //   // setNetworkId(networkId);
      // });
    },
    [web3]
  );

  const onConnect = async (): Promise<void> => {
    const provider = await web3Modal.connect();
    const web3 = initWeb3(provider);
    setWeb3(web3);
    await subscribeProvider(provider, web3);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    setAccount(address);

    const todoLists = new web3.eth.Contract(TODO_LIST.abi as any, TODO_LIST.networks[5777].address);

    const taskCount = await todoLists.methods.taskCount().call();
    setTaskCount(taskCount);

    const tempTask: Array<{
      completed: boolean;
      content: string;
      id: string;
    }> = [];
    setRenderLoading(true);
    for (let i = 1; i <= taskCount; i++) {
      const task = await todoLists.methods.tasks(i).call();
      tempTask.push({
        content: task.content,
        completed: task.completed ?? false,
        id: task.id,
      });
    }
    setTasks(tempTask);
    setRenderLoading(false);
  };

  return (
    <Box p="10" w="600px" m="auto">
      <Box d="flex" alignItems="center">
        <Button my="10" mr="5" colorScheme="facebook" onClick={account ? onLogout : onConnect}>
          {account ? 'Logout' : 'Connect'}
        </Button>
        <b>{account}</b>
      </Box>
      <Divider />
      <Heading my="10">Tasks: {renderLoading ? <Spinner /> : tasks.length}</Heading>

      <Divider />

      {account && (
        <>
          <Box my="10">
            <Input placeholder="Enter task" value={text} onChange={(e) => setText(e.target.value)} />
            <Button
              mt="2"
              colorScheme="linkedin"
              isLoading={addLoading}
              disabled={!text}
              onClick={async () => {
                if (web3 && account) {
                  const todoLists = new web3.eth.Contract(TODO_LIST.abi as any, TODO_LIST.networks[5777].address);

                  setAddLoading(true);
                  const task = await todoLists.methods
                    .createTask(text)
                    .send({ from: account })
                    .once('receipt', async (receipt, f) => {
                      setAddLoading(false);
                      const taskCount = await todoLists.methods.taskCount().call();
                      setTasks((e) => [
                        ...e,
                        {
                          content: text,
                          completed: false,
                          id: taskCount,
                        },
                      ]);
                      setTaskCount(taskCount);
                      setText('');
                    });
                  console.log(task);
                }
              }}
            >
              Add task
            </Button>
          </Box>
          <Divider />
        </>
      )}

      {renderLoading ? (
        <Spinner />
      ) : (
        tasks.map((q) => (
          <Box key={q.id}>
            <Checkbox>{q.content}</Checkbox>
            <br />
          </Box>
        ))
      )}
    </Box>
  );
};

export default Index;
