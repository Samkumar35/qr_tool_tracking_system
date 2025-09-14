import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../api/api_service.dart';
import '../providers/operator_provider.dart';
import '../main.dart'; // Import main.dart to get access to MainScreen

class UserSelectionScreen extends StatefulWidget {
  const UserSelectionScreen({super.key});

  @override
  State<UserSelectionScreen> createState() => _UserSelectionScreenState();
}

class _UserSelectionScreenState extends State<UserSelectionScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _operatorsFuture;

  @override
  void initState() {
    super.initState();
    _operatorsFuture = _apiService.getAllOperators();
  }

  void _selectOperator(String operatorId, String operatorName) {
    // Use the provider to set the currently selected operator
    Provider.of<OperatorProvider>(context, listen: false)
        .selectOperator(operatorId, operatorName);

    // Navigate to the main app screen
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => const MainScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Operator'),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _operatorsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No operators found.'));
          }

          final operators = snapshot.data!;
          return ListView.builder(
            itemCount: operators.length,
            itemBuilder: (context, index) {
              final operator = operators[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: const Icon(Icons.person, size: 40),
                  title: Text(operator['name'],
                      style: const TextStyle(fontSize: 18)),
                  subtitle: Text('ID: ${operator['employee_id']}'),
                  onTap: () =>
                      _selectOperator(operator['id'], operator['name']),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
