import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../api/api_service.dart';

class QrGeneratorScreen extends StatefulWidget {
  final VoidCallback onToolAdded;

  const QrGeneratorScreen({super.key, required this.onToolAdded});

  @override
  State<QrGeneratorScreen> createState() => _QrGeneratorScreenState();
}

class _QrGeneratorScreenState extends State<QrGeneratorScreen> {
  final TextEditingController _idController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _categoryController = TextEditingController();
  String _qrData = '';

  // --- FIX #1: Create an instance of your ApiService ---
  final ApiService _apiService = ApiService();

  void _generateAndSaveTool() async {
    final String toolId = _idController.text;
    final String toolName = _nameController.text;
    final String category = _categoryController.text;

    if (toolId.isEmpty || toolName.isEmpty || category.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields.')),
      );
      return;
    }

    try {
      // --- FIX #2: Call the addTool method on the instance you created ---
      final newTool = await _apiService.addTool(toolName, toolId, category);

      setState(() {
        _qrData = toolId;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text("Tool '${newTool['name']}' added successfully!")),
      );

      Future.delayed(const Duration(seconds: 1), () {
        widget.onToolAdded();
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add New Tool')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Enter Tool Name (e.g., Cordless Drill)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _categoryController,
              decoration: const InputDecoration(
                labelText: 'Enter Category (e.g., Power Tool)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _idController,
              decoration: const InputDecoration(
                labelText: 'Enter Unique Serial Number (e.g., DRILL-007)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _generateAndSaveTool,
              child: const Text('Save Tool & Generate QR'),
            ),
            const SizedBox(height: 40),
            if (_qrData.isNotEmpty)
              Center(
                child: QrImageView(
                  data: _qrData,
                  version: QrVersions.auto,
                  size: 200.0,
                  backgroundColor: Colors.white,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
