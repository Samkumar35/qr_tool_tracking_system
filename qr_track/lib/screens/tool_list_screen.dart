import 'package:flutter/material.dart';
import '../api/api_service.dart';

class ToolListScreen extends StatefulWidget {
  const ToolListScreen({super.key});

  @override
  ToolListScreenState createState() => ToolListScreenState();
}

class ToolListScreenState extends State<ToolListScreen> {
  bool _isLoading = true;
  List<dynamic> _tools = [];

  // --- FIX #1: Create an instance of your ApiService ---
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    fetchTools();
  }

  Future<void> fetchTools() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // --- FIX #2: Call the getTools method on the instance ---
      final tools = await _apiService.getTools();

      if (mounted) {
        setState(() {
          _tools = tools;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
      print('Failed to load tools: $e');
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Failed to load tools. Please log in again.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_tools.isEmpty) {
      return RefreshIndicator(
        onRefresh: fetchTools,
        child: const Center(
          child: Text('No tools found. Pull down to refresh.'),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: fetchTools,
      child: ListView.builder(
        itemCount: _tools.length,
        itemBuilder: (context, index) {
          final tool = _tools[index];
          return ListTile(
            title: Text(tool['name'] ?? 'No Name'),
            subtitle: Text('Category: ${tool['category'] ?? 'N/A'}'),
            trailing: Text('Serial: ${tool['serial_number'] ?? 'N/A'}'),
          );
        },
      ),
    );
  }
}
