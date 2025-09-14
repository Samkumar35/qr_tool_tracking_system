import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Import your providers and screens
import 'providers/operator_provider.dart';
import 'screens/user_selection_screen.dart';
import 'screens/tool_list_screen.dart';
import 'screens/qr_scanner_screen.dart';
import 'screens/qr_generator_screen.dart';

void main() {
  runApp(
    // Use MultiProvider to provide the operator state to the app
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => OperatorProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QR Track',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      // The UserSelectionScreen is now the first page of the app.
      // After selection, it will navigate to the MainScreen.
      home: const UserSelectionScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final GlobalKey<ToolListScreenState> _toolListKey =
      GlobalKey<ToolListScreenState>();

  void _refreshToolListAndSwitchTab() {
    _toolListKey.currentState?.fetchTools();
    setState(() {
      _selectedIndex = 0;
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Get the currently selected operator's name from the provider
    final operatorName =
        Provider.of<OperatorProvider>(context).selectedOperatorName ??
            'Operator';

    final List<Widget> widgetOptions = <Widget>[
      ToolListScreen(key: _toolListKey),
      const QrScannerScreen(),
      QrGeneratorScreen(onToolAdded: _refreshToolListAndSwitchTab),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('QR Track - $operatorName'),
        // Add a leading back button to return to the user selection screen
        leading: IconButton(
          icon: const Icon(Icons.switch_account),
          tooltip: 'Switch Operator',
          onPressed: () {
            // Clear the selected operator
            Provider.of<OperatorProvider>(context, listen: false)
                .clearOperator();
            // Navigate back to the selection screen
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const UserSelectionScreen()),
            );
          },
        ),
      ),
      body: Center(child: widgetOptions.elementAt(_selectedIndex)),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'Tools'),
          BottomNavigationBarItem(
              icon: Icon(Icons.qr_code_scanner), label: 'Scan'),
          BottomNavigationBarItem(icon: Icon(Icons.qr_code), label: 'Generate'),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}
