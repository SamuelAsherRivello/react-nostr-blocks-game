import './../../../styles/App.css';
import { blue } from '@mui/material/colors';
import { Box, ButtonGroup, Collapse, FormControlLabel, IconButton, List, ListItem, ListItemText, Switch, ThemeProvider, Tooltip } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { NostrCustomEvent } from '../nostr/NostrCustomEvent';
import { NostrCustomEventProcessor } from '../nostr/NostrCustomEventProcessor';
import { NostrUser } from '../nostr/NostrUser';
import { NostrUtilities } from '../nostr/NostrUtilities';
import { Relay, Event } from 'nostr-tools';
import { Subscription } from 'nostr-tools/lib/types/relay';
import Button from '@mui/material/Button';
import ContentArea from './ContentArea';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GameStateRenderer2D from './GameStateRenderer2D';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GameStateRenderer3D from './GameStateRenderer3D';

/////////////////////////////////////////////////////////////////////////////
//
// GLOBALS
//
/////////////////////////////////////////////////////////////////////////////

const enum LocalStorageKeys {
  useLocalStorage = 'useLocalStorage',
  //
  nostrUser = 'nostrUser',
  //
  messagesIsFiltered = 'messagesIsFiltered',
  eventMode = 'eventMode',
  //
  isUsingNostrConnect = 'isUsingNostrConnect',
  aboutSectionIsOpen = 'aboutSectionIsOpen',
  outputSectionIsOpen = 'outputSectionIsOpen',
  inputSectionIsOpen = 'inputSectionIsOpen',
  messageIsEncrypted = 'messageIsEncrypted',
  relayUrl = 'relayUrl',
}
declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: Event): Promise<Event>;
      nip04?: {
        encrypt(pubkey: string, plaintext: string): Promise<string>;
        decrypt(pubkey: string, ciphertext: string): Promise<string>;
      };
    };
  }
}

export class PlayerMoveDto {
  //Don't parse
  public static readonly TagName: string = 'playerMoveDto';
  //Parse
  gameId: string = GameState.GameId;
  roundIndexCurrent: number = 0;
  cubeDto: CubeDto = new CubeDto(0, 0, 0, false);
  //
  constructor() {}
  public toJsonString(): string {
    return JSON.stringify({ roundIndexCurrent: this.roundIndexCurrent, gameId: this.gameId, cubeData: this.cubeDto.toJsonString() });
  }

  public static fromJsonString(s: string): PlayerMoveDto {
    const obj = JSON.parse(s);
    const playerMoveDto = new PlayerMoveDto();
    playerMoveDto.roundIndexCurrent = obj.roundIndexCurrent;
    playerMoveDto.gameId = obj.gameId;
    playerMoveDto.cubeDto = CubeDto.fromJsonString(obj.cubeData);
    return playerMoveDto;
  }
}

export class CubeDto {
  //Parse
  x: number = 0;
  y: number = 0;
  z: number = 0;

  //Do not parse
  isAvailable: boolean = true;

  constructor(x: number, y: number, z: number, isAvailable: boolean = true) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.isAvailable = isAvailable;
  }

  public toJsonString(): string {
    return JSON.stringify({ x: this.x, y: this.y, z: this.z });
  }

  public static fromJsonString(s: string): CubeDto {
    const obj = JSON.parse(s);
    const cubeData = new CubeDto(obj.x, obj.y, obj.z);
    return cubeData;
  }
}

export class GameState {
  //
  public static readonly GameId: string = '0003'; //Manually increment for new game
  //
  public static readonly RoundIndexMax: number = 10;
  //
  public roundIndexCurrent: number = 0;
  public cubeDatas: CubeDto[] = [];
  //
  constructor() {
    //Fill with 10 cubes where x = index.
    this.cubeDatas = new Array(GameState.RoundIndexMax).fill(null).map((_, index) => new CubeDto(index + 1, 1, 1, true));
  }
}

const enum EventMode {
  Null = 'Null',
  Message = 'Message',
  GameData = 'GameData',
}

const App: React.FC = () => {
  /////////////////////////////////////////////////////////////////////////////
  //
  // THEME
  //
  /////////////////////////////////////////////////////////////////////////////
  const theme = createTheme({
    palette: {
      primary: {
        light: blue[300],
        main: blue[500],
        dark: blue[700],
      },
      secondary: {
        light: blue[100],
        main: blue[200],
        dark: blue[300],
      },
    },
  });

  /////////////////////////////////////////////////////////////////////////////
  //
  // STATE
  //
  /////////////////////////////////////////////////////////////////////////////
  const [useLocalStorage, setUseLocalStorage] = useState<boolean>(() => {
    const stored = localStorage.getItem(LocalStorageKeys.useLocalStorage);
    return stored ? JSON.parse(stored) : true;
  });
  //

  const [messagesFiltered, setMessagesFiltered] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Event[]>([]);
  const [nextMessage, setNextMessage] = useState('');

  const [gameState, setGameState] = useState<GameState>(new GameState());
  const [nextPlayerMoveDto, setNextPlayerMoveDto] = useState<PlayerMoveDto | undefined>(new PlayerMoveDto());
  const [messagesIsFiltered, setMessagesIsFiltered] = useState<boolean>(() => {
    const stored = localStorage.getItem(LocalStorageKeys.messagesIsFiltered);
    return useLocalStorage && stored ? JSON.parse(stored) : false;
  });
  const [messageIsEncrypted, setMessageIsEncrypted] = useState<boolean>(() => {
    const stored = localStorage.getItem(LocalStorageKeys.messageIsEncrypted);
    return useLocalStorage && stored ? JSON.parse(stored) : false;
  });
  const [relay, setRelay] = useState<Relay | null>(null);
  const [relayUrl, setRelayUrl] = useState(() => {
    const stored = localStorage.getItem(LocalStorageKeys.relayUrl);
    return useLocalStorage && stored ? JSON.parse(stored) : false;
  });

  ///////////////////////////////////////////

  const [nostrUser, setNostrUser] = useState<NostrUser | undefined>(() => {
    const stored = localStorage.getItem(LocalStorageKeys.nostrUser);
    if (stored == 'undefined') {
      console.log('TODO: Debug why this is happening');
      localStorage.removeItem(LocalStorageKeys.nostrUser);
      return;
    }
    return stored ? NostrUser.fromJsonString(stored) : undefined;
  });

  //////////////////////////////////////////
  const [extensionError, setExtensionError] = useState<string | null>(null);
  const [isUsingNostrConnect, setIsUsingNostrConnect] = useState<boolean>(() => {
    const stored = localStorage.getItem(LocalStorageKeys.isUsingNostrConnect);
    return useLocalStorage && stored ? JSON.parse(stored) : false;
  });

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const appIsMounted = useRef(false);

  const [aboutSectionIsOpen, setAboutSectionIsOpen] = useState(() => {
    const stored = localStorage.getItem(LocalStorageKeys.aboutSectionIsOpen);
    return useLocalStorage && stored ? JSON.parse(stored) : true;
  });
  const [inputSectionIsOpen, setInputSectionIsOpen] = useState(() => {
    const stored = localStorage.getItem(LocalStorageKeys.inputSectionIsOpen);
    return useLocalStorage && stored ? JSON.parse(stored) : true;
  });
  const [outputSectionIsOpen, setOutputSectionIsOpen] = useState(() => {
    const stored = localStorage.getItem(LocalStorageKeys.outputSectionIsOpen);
    return useLocalStorage && stored ? JSON.parse(stored) : true;
  });

  let eventMode = useMemo(() => {
    const stored = localStorage.getItem(LocalStorageKeys.eventMode);
    return stored ? stored : EventMode.Null;
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  //
  // REFS
  //
  /////////////////////////////////////////////////////////////////////////////
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const displayedMessages = messagesIsFiltered ? messagesFiltered : messages;

  /////////////////////////////////////////////////////////////////////////////
  //
  // INITIALIZATION
  //
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // NOTE: This effect may run twice in development mode due to React Strict Mode.
    // This is intentional and helps identify potential issues. It won't occur in production.
    // HACK: This is a workaround to prevent the app from running twice in development mode.
    if (!appIsMounted.current) {
      appIsMounted.current = true;
      return;
    }
    console.log('App mounted');

    const initializeApp = async () => {
      //Always
      await randomizeGameData();
      await randomizeMessage();
      //Sometimes
      if (!useLocalStorage) {
        await randomizeRelay();
        if (!isUsingNostrConnect) {
          await randomizeNostrUser();
        }
      } else {
        await connectToRelay(relayUrl);
      }
    };

    initializeApp().catch(console.error);

    return () => {
      console.log('App unmounted');
    };
  }, []); // Empty dependency array ensures this runs only once per mount/unmount

  /////////////////////////////////////////////////////////////////////////////
  //
  // HOOKS
  //
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (relay && nostrUser && nostrUser?.publicKey) {
      subscribeToRelay();
    } else {
      unsubscribeFromRelay();
    }
  }, [relay, nostrUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, messagesFiltered, messagesIsFiltered]);

  useEffect(() => {
    const filtered = messages.filter((msg) => msg.pubkey === nostrUser?.publicKey);
    setMessagesFiltered(filtered);
  }, [messages, nostrUser]);

  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(LocalStorageKeys.messageIsEncrypted, JSON.stringify(messageIsEncrypted));
    }
  }, [messageIsEncrypted, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage && nostrUser !== undefined) {
      localStorage.setItem(LocalStorageKeys.nostrUser, nostrUser.toJsonString());
    } else {
      localStorage.removeItem(LocalStorageKeys.nostrUser);
    }
  }, [nostrUser, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(LocalStorageKeys.isUsingNostrConnect, JSON.stringify(isUsingNostrConnect));
    }
  }, [isUsingNostrConnect, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(LocalStorageKeys.messagesIsFiltered, JSON.stringify(messagesIsFiltered));
    }
  }, [messagesIsFiltered, useLocalStorage]);

  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(LocalStorageKeys.relayUrl, JSON.stringify(relayUrl));
    }
  }, [relayUrl, useLocalStorage]);

  useEffect(() => {
    if (!useLocalStorage) {
      localStorage.clear();

      setMessagesIsFiltered(false);
      setMessageIsEncrypted(false);
      setIsUsingNostrConnect(false);
      setNostrUser(undefined);
    }
    localStorage.setItem(LocalStorageKeys.useLocalStorage, JSON.stringify(useLocalStorage));
  }, [useLocalStorage]);

  /////////////////////////////////////////////////////////////////////////////
  //
  // FUNCTIONS
  //
  /////////////////////////////////////////////////////////////////////////////

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const connectToNostr = async () => {
    setExtensionError(null);
    try {
      if (typeof window.nostr === 'undefined') {
        throw new Error('Nostr extension not found. Please install a Nostr extension.');
      }

      const pubKey = await window.nostr.getPublicKey();
      const nostrUser = new NostrUser(pubKey);
      setNostrUser(nostrUser);
    } catch (err) {
      setExtensionError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const disconnectFromNostr = () => {
    setNostrUser(undefined);
    if (useLocalStorage) {
      localStorage.removeItem(LocalStorageKeys.nostrUser);
    }
  };

  const randomizeNostrUser = () => {
    const nostrUser: NostrUser = new NostrUser();
    setNostrUser(nostrUser);
  };

  const verifyUserKey = () => {
    nostrUser?.publicKey && window.open(`https://primal.net/p/${nostrUser.publicKey}`, '_blank');
  };

  const randomizeRelay = async () => {
    const relays = ['wss://ch.purplerelay.com', 'wss://ir.purplerelay.com'];
    let nextRelay = relays[0];

    //If we have multiple options, be sure to pick a new
    if (relays.length > 1) {
      while (nextRelay === relayUrl) {
        nextRelay = relays[Math.floor(Math.random() * relays.length)];
      }
    }
    if (nextRelay) {
      await setRelayUrl(nextRelay);
      await connectToRelay(nextRelay);
    } else {
      console.error('No relay found');
    }
  };

  const isIncomingEventIsEncrypted = (event: Event): boolean => {
    return event.kind === 4;
  };

  const isIncomingEventAGameData = (event: Event): boolean => {
    return event.tags.some((tag) => tag[0] === PlayerMoveDto.TagName);
  };

  const isIncomingEventContentValid = (content: String): boolean => {
    const blacklist = ['tracking strings detected and removed'];
    content = content.toLowerCase();
    return !blacklist.some((item) => content.includes(item.toLowerCase()));
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const formatEventContentLine1 = (event: Event): React.ReactNode => {
    const content = event.content;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const imageRegex = /(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i;

    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        if (imageRegex.test(part)) {
          return <img key={index} src={part} alt="content" style={{ maxWidth: '100%', height: 'auto' }} />;
        } else {
          return (
            <a key={index} href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
      } else {
        return part;
      }
    });
  };

  const formatEventContentLine2 = (event: Event): React.ReactNode => {
    const encrypted = event.tags.some((tag) => tag[0] === 'p') ? '🔐' : '🔓';
    return (
      <Typography variant="body2">
        {encrypted} From <b>{NostrUtilities.formatPublicKeyShort(event.pubkey)}</b> At <b>{formatTimestamp(event.created_at)}</b>
      </Typography>
    );
  };

  const unsubscribeFromRelay = () => {
    if (subscription && !subscription.closed) {
      subscription.close();
      setSubscription(null);
      console.log('Relay Unsubscribe Complete');
    }
  };

  const subscribeToRelay = async () => {
    if (!relay) return;

    if (subscription && !subscription.closed) {
      unsubscribeFromRelay();
    }

    const sub = relay.subscribe(
      [
        {
          kinds: [1, 4],
          limit: 20,
        },
      ],
      {
        async onevent(event) {
          if (isIncomingEventIsEncrypted(event)) {
            console.log(event);

            const isForMe = event.pubkey === nostrUser?.publicKey;

            isForMe && console.log('Decrypted event is for me!');

            let oldContent = event.content;
            if (isForMe) {
              if (isUsingNostrConnect) {
                if (NostrCustomEventProcessor.hasNostrConnect()) {
                  throw new Error('Nostr extension does not support NIP-04 encryption.');
                }
                event.content = await NostrCustomEventProcessor.decryptWithNostrConnectAsync(event.content, nostrUser!.publicKey);
              } else if (nostrUser!.privateKey) {
                event.content = await NostrCustomEventProcessor.decryptAsync(event.content, nostrUser!.publicKey, nostrUser!.privateKey);
              } else {
                throw new Error('Unable to encrypt message: No private key available.');
              }

              console.log('Decrypted:', oldContent, '->', event.content);
            }
          }
          //GAME
          if (isIncomingEventAGameData(event)) {
            const gameDataString = event.tags.find((tag) => tag[0] === PlayerMoveDto.TagName)![1];

            try {
              //
              const playermoveDto: PlayerMoveDto = PlayerMoveDto.fromJsonString(gameDataString);

              if (playermoveDto.gameId === GameState.GameId) {
                gameState.roundIndexCurrent = playermoveDto.roundIndexCurrent + 1;

                //set gameState.cubeDatas isAvailable to false
                gameState.cubeDatas.map((cubeDto) => {
                  //Cubs are available by default on page load
                  //so ONLY change them as not when event says so
                  if (cubeDto.x === playermoveDto.cubeDto.x && cubeDto.y === playermoveDto.cubeDto.y && cubeDto.z === playermoveDto.cubeDto.z) {
                    cubeDto.isAvailable = false;
                  }
                });

                gameState.cubeDatas.map((cube, index) => {
                  console.log(`cube [${index}]: ` + cube.isAvailable);
                });
                setGameState(gameState);
              }
            } catch (error) {
              console.error('Decryption??? Failed to parse game data:', error);
            }
          }

          //MESSAGE (also send game stuff here for now)
          if (isIncomingEventContentValid(event.content)) {
            setMessages((prevMessages) => {
              const messageExists = prevMessages.some((msg) => msg.id === event.id);
              if (!messageExists) {
                const updatedMessages = [...prevMessages, event];
                return updatedMessages.slice(-10);
              }
              return prevMessages;
            });
          }
        },

        oneose() {
          console.log('Relay Subscribe Complete');
        },
      },
    );

    setSubscription(sub);
  };

  const connectToRelay = async (nextRelay: string) => {
    const newRelay = new Relay(nextRelay);
    try {
      await newRelay.connect();
      console.log(`Connected to ${nextRelay}`);
      setRelay(newRelay);

      await subscribeToRelay();
    } catch (error) {
      console.error('Failed to connect to relay:', error);
    }
  };

  const verifyRelay = () => {
    const formattedRelayUrl = relayUrl.replace('wss://', 'https://');
    formattedRelayUrl && window.open(`${formattedRelayUrl}`, '_blank');
  };

  const refreshMessages = () => {
    setMessages([]);
    setMessagesFiltered([]);
    unsubscribeFromRelay();
    subscribeToRelay();
  };

  const togglemessagesIsFiltered = () => {
    setMessagesIsFiltered((prev) => !prev);
  };

  const toggleMessageIsEncrypted = () => {
    setMessageIsEncrypted((prev) => !prev);
  };

  const toggleIsUsingNostrConnect = () => {
    setExtensionError('');
    setNostrUser(undefined);
    setIsUsingNostrConnect((prev) => !prev);
  };

  const toggleUseLocalStorage = () => {
    setUseLocalStorage((prev) => !prev);
  };

  /////////////////////////////////////////////////////////////////////////////
  //
  // EVENT HANDLERS
  //
  /////////////////////////////////////////////////////////////////////////////

  //TODO: this is not editable so,... needed?
  const handleMessageNewInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNextMessage(event.target.value);
  };

  //TODO: this is not editable so,... needed?
  const handleGameDataNewInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const playerMoveDto: PlayerMoveDto = PlayerMoveDto.fromJsonString(event.target.value);
    setNextPlayerMoveDto(playerMoveDto);
  };

  const randomizeMessage = async () => {
    const hellos = ['Hello', 'Greetings', 'Salutations'];
    const worlds = ['World', 'People', 'Universe'];

    const hello = hellos[Math.floor(Math.random() * hellos.length)];
    const world = worlds[Math.floor(Math.random() * worlds.length)];
    const number = Math.floor(Math.random() * 100); //make always 3 digits
    const randomMessageNew = `${hello}, ${world}! ...${number}`;
    setNextMessage(randomMessageNew);
  };

  const randomizeGameData = async () => {
    //
    // TODO: Game Idea
    // APP: https://threejs.org/examples/webgl_interactive_voxelpainter.html
    // game world: relay hardcode
    // each player moves with their own public key......
    // send message with "pubkey: gamepublickey,"
    console.log('gameState.roundIndexCurrent: ' + gameState.roundIndexCurrent + ' and next : ' + (gameState.roundIndexCurrent + 1));
    const roundIndexCurrent = gameState.roundIndexCurrent + 1;
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const z = Math.floor(Math.random() * 10);
    //
    const playerMoveDto = new PlayerMoveDto();
    playerMoveDto.roundIndexCurrent = roundIndexCurrent;
    playerMoveDto.cubeDto = new CubeDto(x, y, z);

    setNextPlayerMoveDto(playerMoveDto);
  };

  const sendEventMessageAsync = async () => {
    eventMode = EventMode.Message;
    await sendEventAsync(nextMessage);
    setNextMessage('');
  };

  const sendEventGameDataAsync = async () => {
    eventMode = EventMode.GameData;

    if (nextPlayerMoveDto) {
      await sendEventAsync(nextPlayerMoveDto.toJsonString());
    } else {
      console.error('sendEventGameDataAsync failed. nextPlayerMoveDto is not set');
    }

    setNextPlayerMoveDto(undefined);
  };

  const sendEventAsync = async (contentText: string) => {
    if (contentText.trim() === '') {
      console.error('contentText is not set');
      return;
    }

    if (!nostrUser || !nostrUser?.publicKey) {
      console.error('Must have userKeyPublic first.');
      return;
    }

    if (!isUsingNostrConnect && (!nostrUser || !nostrUser?.privateKey)) {
      console.error('Private key is not set and Nostr Connect is not enabled');
      return;
    }

    if (!relay) {
      console.error('Relay is not connected');
      return;
    }

    try {
      let content: string = contentText;
      if (messageIsEncrypted) {
        //In production, you use recipients info here
        const recipientsPublicKey = nostrUser!.publicKey;
        if (isUsingNostrConnect) {
          if (NostrCustomEventProcessor.hasNostrConnect()) {
            throw new Error('Nostr extension does not support NIP-04 encryption.');
          }
          content = await NostrCustomEventProcessor.encryptWithNostrConnectAsync(contentText, recipientsPublicKey);
        } else if (nostrUser!.privateKey) {
          content = await NostrCustomEventProcessor.encryptAsync(contentText, recipientsPublicKey, nostrUser!.privateKey);
        } else {
          throw new Error('Unable to encrypt message: No private key available.');
        }
      }

      let nostrCustomEvent: NostrCustomEvent = new NostrCustomEvent();
      nostrCustomEvent.created_at = Math.floor(Date.now() / 1000);
      nostrCustomEvent.pubkey = nostrUser!.publicKey;
      nostrCustomEvent.kind = messageIsEncrypted ? 4 : 1;

      //Tags --------------------------------------------
      nostrCustomEvent.tags = [];
      if (messageIsEncrypted) {
        nostrCustomEvent.tags.push(['p', nostrUser!.publicKey]);
      }

      // Modes --------------------------------------------
      switch (eventMode) {
        case EventMode.Message:
          //
          //Keep this as content
          nostrCustomEvent.content = content;
          break;
        case EventMode.GameData:
          //
          //TODO: Maybe send move as content or maybe as tag or both?
          nostrCustomEvent.content = content;
          //Always
          nostrCustomEvent.tags.push([PlayerMoveDto.TagName, content]);
          break;
        default:
          console.error('Unknown eventMode');
      }

      if (isUsingNostrConnect) {
        if (!NostrCustomEventProcessor.hasNostrConnect()) {
          throw Error('Nostr extension does not support NIP-04 encryption.');
        }
        nostrCustomEvent = await NostrCustomEventProcessor.signEventAsync(nostrCustomEvent);
      } else if (nostrUser!.privateKey) {
        nostrCustomEvent = NostrCustomEventProcessor.finalizeEvent(nostrCustomEvent, nostrUser!.privateKey);
      } else {
        throw new Error('Unable to sign event: No private key available.');
      }

      let isVerified = NostrCustomEventProcessor.verifyEvent(nostrCustomEvent);
      if (!isVerified) {
        console.error('Event is not valid');
        return;
      }

      console.log(`Message send ${eventMode.toString()}, with tags ${nostrCustomEvent.tags.length} to ${relayUrl}`);
      await relay.publish(nostrCustomEvent);
      console.log('Message sent:', nostrCustomEvent);

      if (eventMode == EventMode.Message) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, { ...nostrCustomEvent, content: content }];
          return updatedMessages.slice(-10);
        });
      } else if (eventMode == EventMode.GameData) {
        console.log('do something for clearing OUTPUT ui for game data?');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputSectionToggle = () => {
    setInputSectionIsOpen(!inputSectionIsOpen);
    if (useLocalStorage) {
      //TODO: This works, but why do I store !value?
      localStorage.setItem(LocalStorageKeys.inputSectionIsOpen, JSON.stringify(!inputSectionIsOpen));
    }
  };

  const handleOutputSectionToggle = () => {
    setOutputSectionIsOpen(!outputSectionIsOpen);
    if (useLocalStorage) {
      //TODO: This works, but why do I store !value?
      localStorage.setItem(LocalStorageKeys.outputSectionIsOpen, JSON.stringify(!outputSectionIsOpen));
    }
  };

  const handleAboutSectionToggle = () => {
    setAboutSectionIsOpen(!aboutSectionIsOpen);
    if (useLocalStorage) {
      //TODO: This works, but why do I store !value?
      localStorage.setItem(LocalStorageKeys.aboutSectionIsOpen, JSON.stringify(!aboutSectionIsOpen));
    }
  };
  function onCubeClick(cubeDto: CubeDto): void {
    console.log('Cube clicked:', cubeDto);
    const playerMoveDto = new PlayerMoveDto();
    playerMoveDto.roundIndexCurrent = gameState.roundIndexCurrent + 1;
    playerMoveDto.cubeDto = cubeDto;
    setNextPlayerMoveDto(playerMoveDto);
  }

  /////////////////////////////////////////////////////////////////////////////
  //
  // RENDER
  //
  /////////////////////////////////////////////////////////////////////////////
  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <Box className="app">
          <Box>
            {/*   
            /////////////////////////////////////////////////////////////////////////////
            //
            // ABOUT
            //
            ///////////////////////////////////////////////////////////////////////////// 
            */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleAboutSectionToggle} className="collapse-toggle">
                <ExpandMoreIcon style={{ transform: aboutSectionIsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s' }} />
                <Typography variant="h5">About</Typography>
              </IconButton>
            </div>
            <Collapse in={aboutSectionIsOpen} className="collapse">
              <ContentArea title="About" className="content-area">
                <div>
                  <Typography variant="body1">Send and receive encrypted messages using the Nostr web3 protocol.</Typography>
                  <Typography variant="body1" component="div" sx={{ marginBottom: 2 }}></Typography>
                  <Typography variant="body1" component="div" sx={{ marginBottom: 2 }}></Typography>
                  <Typography variant="body1">
                    Technologies: <a href="https://reactjs.org/">React</a>, <a href="https://mui.com/">Material-UI</a>, and{' '}
                    <a href="https://github.com/fiatjaf/nostr-tools">Nostr Tools</a>.
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ marginBottom: 2 }}></Typography>
                  <Typography variant="body1" component="div" sx={{ marginBottom: 2 }}></Typography>
                  <Typography variant="body1">
                    Source: <a href="https://github.com/SamuelAsherRivello/react-nostr-chat">GitHub.com/SamuelAsherRivello/react-nostr-chat</a>.
                  </Typography>
                </div>
                <Box className="content-area-nav">
                  <ButtonGroup className="content-area-button-group"></ButtonGroup>
                  <Tooltip title="Use Local Storage">
                    <FormControlLabel
                      control={<Switch checked={useLocalStorage} onChange={toggleUseLocalStorage} name="useLocalStorage" color="primary" />}
                      label="Use LocalStorage"
                    />
                  </Tooltip>
                </Box>
              </ContentArea>
            </Collapse>

            {/*   
          /////////////////////////////////////////////////////////////////////////////
          //
          // INPUT
          //
          ///////////////////////////////////////////////////////////////////////////// 
          */}

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleInputSectionToggle} className="collapse-toggle">
                <ExpandMoreIcon style={{ transform: inputSectionIsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s' }} />
                <Typography variant="h5">Input</Typography>
              </IconButton>
            </div>
            <Collapse in={inputSectionIsOpen} className="collapse">
              <ContentArea title="User" className="content-area">
                <TextField
                  className="textField"
                  label="Public Key"
                  value={nostrUser ? nostrUser.publicKey : ''}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  margin="normal"
                />
                <Box className="content-area-nav">
                  <ButtonGroup className="content-area-button-group">
                    {isUsingNostrConnect ? (
                      <>
                        <Tooltip title="Connect To Nostr Connect">
                          <span>
                            <Button variant="contained" onClick={connectToNostr} disabled={nostrUser && NostrUtilities.isValidPublicKey(nostrUser?.publicKey)}>
                              Nostr Connect
                            </Button>
                          </span>
                        </Tooltip>
                        <Tooltip title="Disconnect From Nostr Connect">
                          <span>
                            <Button variant="contained" onClick={disconnectFromNostr} disabled={!nostrUser || !nostrUser!.publicKey} color="primary">
                              Nostr Disconnect
                            </Button>
                          </span>
                        </Tooltip>
                        <Tooltip title="Verify User Public Key">
                          <span>
                            <Button variant="contained" onClick={verifyUserKey} disabled={!nostrUser || !nostrUser!.publicKey} color="secondary">
                              Verify
                            </Button>
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Randomize User Public Key">
                          <span>
                            <Button onClick={randomizeNostrUser} variant="contained" color="primary">
                              Randomize
                            </Button>
                          </span>
                        </Tooltip>
                        <Tooltip title="Verify User Public Key">
                          <span>
                            <Button variant="contained" onClick={verifyUserKey} disabled={!nostrUser || !nostrUser?.publicKey} color="secondary">
                              Verify
                            </Button>
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </ButtonGroup>
                  <FormControlLabel
                    control={<Switch checked={isUsingNostrConnect} onChange={toggleIsUsingNostrConnect} name="useNostrConnect" color="primary" />}
                    label="Use Nostr Connect"
                  />
                </Box>
                {extensionError && <Typography color="error">{extensionError}</Typography>}
              </ContentArea>

              <ContentArea title="Relay" className="content-area">
                <TextField
                  label="Url"
                  value={relayUrl}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  margin="normal"
                />
                <Box className="content-area-nav">
                  <ButtonGroup className="content-area-button-group">
                    <Tooltip title="Randomize Relay">
                      <span>
                        <Button variant="contained" onClick={randomizeRelay} color="primary">
                          Randomize
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Verify Relay">
                      <span>
                        <Button variant="contained" onClick={verifyRelay} color="secondary">
                          Verify
                        </Button>
                      </span>
                    </Tooltip>
                  </ButtonGroup>
                </Box>
              </ContentArea>

              <ContentArea title="Send Message" className="content-area">
                <Typography>
                  Send a <b>message</b> from{' '}
                  <Typography component="span" fontWeight="bold">
                    {nostrUser && NostrUtilities.formatPublicKeyShort(nostrUser?.publicKey)}
                  </Typography>{' '}
                  to{' '}
                  <Typography component="span" fontWeight="bold">
                    {nostrUser && NostrUtilities.formatPublicKeyShort(nostrUser?.publicKey)}
                  </Typography>{' '}
                  on{' '}
                  <Typography component="span" fontWeight="bold">
                    {relayUrl}
                  </Typography>
                  .
                </Typography>
                <TextField
                  label="New Message"
                  multiline={false}
                  value={nextMessage}
                  onChange={handleMessageNewInputChange}
                  fullWidth={true}
                  variant="outlined"
                  margin="normal"
                />
                <Box className="content-area-nav">
                  <ButtonGroup className="content-area-button-group">
                    <Tooltip title="Send Message">
                      <span>
                        <Button variant="contained" color="primary" onClick={sendEventMessageAsync} disabled={nextMessage.length == 0 || !nostrUser}>
                          Send
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Randomize Message">
                      <span>
                        <Button variant="contained" color="secondary" onClick={randomizeMessage} disabled={!nostrUser}>
                          Randomize
                        </Button>
                      </span>
                    </Tooltip>
                  </ButtonGroup>
                  <FormControlLabel
                    control={<Switch checked={messageIsEncrypted} onChange={toggleMessageIsEncrypted} name="messageIsEncrypted" color="primary" />}
                    label="Message Is Encrypted"
                  />
                </Box>
              </ContentArea>

              <ContentArea title="Send Game Data" className="content-area">
                <Typography>
                  Send <b>game data</b> from{' '}
                  <Typography component="span" fontWeight="bold">
                    {nostrUser && NostrUtilities.formatPublicKeyShort(nostrUser?.publicKey)}
                  </Typography>{' '}
                  to{' '}
                  <Typography component="span" fontWeight="bold">
                    {nostrUser && NostrUtilities.formatPublicKeyShort(nostrUser?.publicKey)}
                  </Typography>{' '}
                  on{' '}
                  <Typography component="span" fontWeight="bold">
                    {relayUrl}
                  </Typography>
                  .
                </Typography>
                <GameStateRenderer2D gameState={gameState} onCubeClick={onCubeClick} />
                <GameStateRenderer3D gameState={gameState} onCubeClick={onCubeClick} />
                <TextField
                  label="New Game Data"
                  multiline={false}
                  value={nextPlayerMoveDto ? nextPlayerMoveDto.toJsonString() : ''}
                  onChange={handleGameDataNewInputChange}
                  fullWidth={true}
                  inputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
                <Box className="content-area-nav">
                  <ButtonGroup className="content-area-button-group">
                    <Tooltip title="Send Game Data">
                      <span>
                        <Button variant="contained" color="primary" onClick={sendEventGameDataAsync} disabled={!nextPlayerMoveDto || !nostrUser}>
                          Send
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Randomize Message">
                      <span>
                        <Button variant="contained" color="secondary" onClick={randomizeGameData} disabled={!nostrUser}>
                          Randomize
                        </Button>
                      </span>
                    </Tooltip>
                  </ButtonGroup>
                  <FormControlLabel
                    control={<Switch checked={messageIsEncrypted} onChange={toggleMessageIsEncrypted} name="messageIsEncrypted" color="primary" />}
                    label="Message Is Encrypted"
                  />
                </Box>
              </ContentArea>
            </Collapse>

            {/*   
          /////////////////////////////////////////////////////////////////////////////
          //
          // OUTPUT
          //
          ///////////////////////////////////////////////////////////////////////////// 
          */}

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleOutputSectionToggle} className="collapse-toggle">
                <ExpandMoreIcon style={{ transform: outputSectionIsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s' }} />
                <Typography variant="h5">Output</Typography>
              </IconButton>
            </div>
            <Collapse in={outputSectionIsOpen} className="collapse">
              <ContentArea title="List Messages" className="content-area">
                <Box
                  ref={messagesContainerRef}
                  sx={{
                    minHeight: '200px',
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    border: '1px solid #ccc',
                    marginBottom: 2,
                  }}
                >
                  <List className="message-list">
                    {displayedMessages.map((msg) => (
                      <ListItem key={msg.id} className="message-list-item">
                        <ListItemText primary={<Typography>{formatEventContentLine1(msg)}</Typography>} secondary={formatEventContentLine2(msg)} />
                      </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                  </List>
                </Box>
                <Box className="content-area-nav">
                  <ButtonGroup variant="contained" className="content-area-button-group">
                    <Tooltip title="Refresh Message List">
                      <span>
                        <Button variant="contained" color="primary" onClick={refreshMessages}>
                          Refresh
                        </Button>
                      </span>
                    </Tooltip>
                  </ButtonGroup>
                  <FormControlLabel
                    control={<Switch checked={messagesIsFiltered} onChange={togglemessagesIsFiltered} name="messageFilter" color="primary" />}
                    label="Show only my messages"
                  />
                </Box>
              </ContentArea>
            </Collapse>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default App;
